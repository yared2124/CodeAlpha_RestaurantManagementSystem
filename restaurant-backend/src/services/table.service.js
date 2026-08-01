import { sequelize, Table, Reservation } from "../models/index.js";
import { NotFoundError } from "../utils/errors.js";
import { Op } from "sequelize";

class TableService {
  async getAllTables() {
    return Table.findAll();
  }

  async getTableById(id) {
    const table = await Table.findByPk(id);
    if (!table) throw new NotFoundError("Table");
    return table;
  }

  async updateTableStatus(id, status) {
    const table = await this.getTableById(id);
    await table.update({ status });
    return table;
  }

  async createTable(data) {
    return Table.create(data);
  }

  /**
   * Check if a table is available for a given time slot.
   * @param {UUID} tableId
   * @param {Date} startTime
   * @param {number} durationMinutes – default 90
   * @returns {Promise<boolean>}
   */
  async isTableAvailable(tableId, startTime, durationMinutes = 90) {
    const table = await Table.findByPk(tableId);
    if (!table || table.status !== "available") return false;

    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // Check overlapping reservations
    const overlapping = await Reservation.findOne({
      where: {
        tableId,
        status: { [Op.in]: ["confirmed", "checked-in"] },
        [Op.or]: [
          { reservationTime: { [Op.between]: [startTime, endTime] } },
          {
            [Op.and]: [
              { reservationTime: { [Op.lte]: startTime } },
              {
                [Op.and]: [
                  sequelize.literal(
                    `"reservationTime" + ("durationMinutes" || ' minutes')::interval > :startTime`,
                  ),
                ],
              },
            ],
          },
        ],
      },
      replacements: { startTime },
    });

    return !overlapping;
  }

  // Reservation methods
  async createReservation(data) {
    // Ensure reservationTime is a Date object
    const reservationTime = new Date(data.reservationTime);
    if (isNaN(reservationTime.getTime())) {
      throw new Error("Invalid reservation time format");
    }

    // Check table availability
    const available = await this.isTableAvailable(
      data.tableId,
      reservationTime,
      data.durationMinutes || 90,
    );
    if (!available) {
      throw new Error("Table not available for the selected time");
    }
    return Reservation.create(data);
  }

  async getReservations(filters = {}) {
    const where = {};
    if (filters.tableId) where.tableId = filters.tableId;
    if (filters.status) where.status = filters.status;
    return Reservation.findAll({ where, include: ["table"] });
  }

  // Occupy/free table (called from order events)
  async occupyTable(tableId, orderId) {
    const table = await this.getTableById(tableId);
    await table.update({ status: "occupied", currentOrderId: orderId });
  }

  async freeTable(tableId) {
    const table = await this.getTableById(tableId);
    await table.update({ status: "available", currentOrderId: null });
  }
}

export default new TableService();
