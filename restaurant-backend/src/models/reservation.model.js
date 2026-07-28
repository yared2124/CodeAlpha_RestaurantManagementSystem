import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Reservation = sequelize.define(
  "Reservation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tableId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Tables", key: "id" },
    },
    customerName: { type: DataTypes.STRING(255), allowNull: false },
    customerPhone: { type: DataTypes.STRING(20) },
    customerEmail: { type: DataTypes.STRING(255) },
    reservationTime: { type: DataTypes.DATE, allowNull: false },
    durationMinutes: { type: DataTypes.INTEGER, defaultValue: 90 },
    partySize: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("confirmed", "checked-in", "cancelled", "completed"),
      defaultValue: "confirmed",
    },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default Reservation;
