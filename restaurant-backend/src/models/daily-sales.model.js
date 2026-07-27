import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DailySales = sequelize.define(
  "DailySales",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    totalOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalRevenue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    dineInRevenue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    takeawayRevenue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    deliveryRevenue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default DailySales;
