import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ingredient = sequelize.define(
  "Ingredient",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    unit: { type: DataTypes.STRING(20), allowNull: false },
    stockQuantity: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    minThreshold: { type: DataTypes.DECIMAL(10, 2), defaultValue: 5 },
    reorderQuantity: { type: DataTypes.DECIMAL(10, 2) },
    lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default Ingredient;
