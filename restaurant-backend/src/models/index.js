import sequelize from "../config/database.js";

// Import all models
import User from "./user.model.js";
import Category from "./category.model.js";
import MenuItem from "./menu-item.model.js";
import Table from "./table.model.js";
import Reservation from "./reservation.model.js";
import Ingredient from "./ingredient.model.js";
import Recipe from "./recipe.model.js";
import InventoryTransaction from "./inventory-transaction.model.js";
import DailySales from "./daily-sales.model.js";
import StockAlert from "./stock-alert.model.js";
import Order from "./order.model.js";
import OrderItem from "./order-item.model.js";

// ---------- Define Associations ----------

// Order <-> OrderItem (one-to-many)
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Category <-> MenuItem (one-to-many)
Category.hasMany(MenuItem, { foreignKey: "categoryId" });
MenuItem.belongsTo(Category, { foreignKey: "categoryId" });

// MenuItem <-> Recipe (one-to-many)
MenuItem.hasMany(Recipe, { foreignKey: "menuItemId" });
Recipe.belongsTo(MenuItem, { foreignKey: "menuItemId" });

// Ingredient <-> Recipe (one-to-many)
Ingredient.hasMany(Recipe, { foreignKey: "ingredientId" });
Recipe.belongsTo(Ingredient, { foreignKey: "ingredientId", as: "ingredient" });

// Ingredient <-> InventoryTransaction (one-to-many)
Ingredient.hasMany(InventoryTransaction, { foreignKey: "ingredientId" });
InventoryTransaction.belongsTo(Ingredient, { foreignKey: "ingredientId" });

// Table <-> Reservation (one-to-many)
Table.hasMany(Reservation, { foreignKey: "tableId" });
Reservation.belongsTo(Table, { foreignKey: "tableId" });

// Table <-> Order (one-to-many) – optional association
Table.hasMany(Order, { foreignKey: "tableId" });
Order.belongsTo(Table, { foreignKey: "tableId" });

// Export all models and the sequelize instance
export {
  sequelize,
  User,
  Category,
  MenuItem,
  Table,
  Reservation,
  Ingredient,
  Recipe,
  InventoryTransaction,
  DailySales,
  StockAlert,
  Order,
  OrderItem,
};
