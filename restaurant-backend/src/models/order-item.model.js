import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Orders", key: "id" },
    },
    menuItemId: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.quantity * this.unitPrice;
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

export default OrderItem;
