import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Table = sequelize.define(
  "Table",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "available",
        "occupied",
        "reserved",
        "out-of-service",
      ),
      defaultValue: "available",
    },
    location: { type: DataTypes.STRING(100) },
    currentOrderId: { type: DataTypes.UUID }, // reference to Order (not enforced)
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default Table;
