import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MenuItem = sequelize.define(
  "MenuItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Categories", key: "id" },
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    preparationTimeMinutes: { type: DataTypes.INTEGER },
    imageUrl: { type: DataTypes.TEXT },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default MenuItem;
