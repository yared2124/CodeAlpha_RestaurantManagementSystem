import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tableId: { type: DataTypes.UUID },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "served",
        "completed",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    orderType: {
      type: DataTypes.ENUM("dine-in", "takeaway", "delivery"),
      allowNull: false,
    },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default Order;
