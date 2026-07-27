import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StockAlert = sequelize.define(
  "StockAlert",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ingredientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Ingredients", key: "id" },
    },
    ingredientName: { type: DataTypes.STRING(255), allowNull: false },
    currentStock: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    threshold: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    alertType: { type: DataTypes.ENUM("low", "critical"), allowNull: false },
    resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
    resolvedAt: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default StockAlert;
