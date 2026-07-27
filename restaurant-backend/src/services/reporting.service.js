import { DailySales, StockAlert, Order } from "../models/index.js";
import { Op } from "sequelize";

class ReportingService {
  /**
   * Update or create daily sales record for a given date.
   * Called when an order is completed.
   */
  async updateDailySales(date, orderTotal, orderType) {
    const [record] = await DailySales.findOrCreate({
      where: { date },
      defaults: {
        date,
        totalOrders: 0,
        totalRevenue: 0,
        dineInRevenue: 0,
        takeawayRevenue: 0,
        deliveryRevenue: 0,
      },
    });

    record.totalOrders += 1;
    record.totalRevenue = Number(record.totalRevenue) + Number(orderTotal);
    if (orderType === "dine-in") {
      record.dineInRevenue = Number(record.dineInRevenue) + Number(orderTotal);
    } else if (orderType === "takeaway") {
      record.takeawayRevenue =
        Number(record.takeawayRevenue) + Number(orderTotal);
    } else if (orderType === "delivery") {
      record.deliveryRevenue =
        Number(record.deliveryRevenue) + Number(orderTotal);
    }
    await record.save();
  }

  /**
   * Get daily sales for a specific date (or today).
   */
  async getDailySales(date) {
    const record = await DailySales.findOne({ where: { date } });
    return record || { date, totalOrders: 0, totalRevenue: 0 };
  }

  /**
   * Get unresolved stock alerts.
   */
  async getStockAlerts() {
    return StockAlert.findAll({ where: { resolved: false } });
  }

  /**
   * Mark a stock alert as resolved.
   */
  async resolveStockAlert(alertId) {
    const alert = await StockAlert.findByPk(alertId);
    if (!alert) throw new Error("Alert not found");
    await alert.update({ resolved: true, resolvedAt: new Date() });
  }
}

export default new ReportingService();
