import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Recipe = sequelize.define(
  "Recipe",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    menuItemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "MenuItems", key: "id" },
    },
    ingredientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Ingredients", key: "id" },
    },
    quantityRequired: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit: { type: DataTypes.STRING(20) },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ["menuItemId", "ingredientId"], unique: true }, // prevent duplicates
    ],
  },
);

export default Recipe;
