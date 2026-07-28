import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const InventoryTransaction = sequelize.define(
  "InventoryTransaction",
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
    orderId: { type: DataTypes.UUID }, // can link to an order
    changeAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    reason: { type: DataTypes.STRING(255) },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default InventoryTransaction;
