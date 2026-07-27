import {
  Ingredient,
  Recipe,
  InventoryTransaction,
  StockAlert,
} from "../models/index.js";
import { sequelize } from "../models/index.js";
import { publishEvent } from "../utils/messaging.js";
import logger from "../utils/logger.js";

class InventoryService {
  /**
   * Validate if enough stock exists for a list of order items.
   * @param {Array<{menuItemId, quantity}>} items
   * @returns {Promise<{available: boolean, missingItems: string[]}>}
   */
  async validateStock(items) {
    const missing = [];
    for (const item of items) {
      const recipe = await Recipe.findAll({
        where: { menuItemId: item.menuItemId },
        include: ["ingredient"],
      });
      for (const row of recipe) {
        const required = Number(row.quantityRequired) * item.quantity;
        if (Number(row.ingredient.stockQuantity) < required) {
          missing.push(row.ingredient.name);
        }
      }
    }
    return { available: missing.length === 0, missingItems: missing };
  }

  /**
   * Deduct stock for an order. Uses a transaction.
   * @param {Array<{menuItemId, quantity}>} items
   * @param {string} orderId
   * @returns {Promise<{success: boolean, changes?: Array, reason?: string}>}
   */
  async deductStock(items, orderId) {
    const t = await sequelize.transaction();
    try {
      const changes = [];
      for (const item of items) {
        const recipe = await Recipe.findAll({
          where: { menuItemId: item.menuItemId },
          include: ["ingredient"],
          transaction: t,
        });
        for (const row of recipe) {
          const ingredient = row.ingredient;
          const required = Number(row.quantityRequired) * item.quantity;
          if (Number(ingredient.stockQuantity) < required) {
            throw new Error(`Insufficient stock for ${ingredient.name}`);
          }
          // Decrement
          ingredient.stockQuantity =
            Number(ingredient.stockQuantity) - required;
          await ingredient.save({ transaction: t });

          // Log transaction
          await InventoryTransaction.create(
            {
              ingredientId: ingredient.id,
              orderId,
              changeAmount: -required,
              reason: `Order ${orderId}`,
            },
            { transaction: t },
          );

          changes.push({
            ingredientId: ingredient.id,
            name: ingredient.name,
            deducted: required,
          });

          // Check low stock threshold
          if (
            Number(ingredient.stockQuantity) < Number(ingredient.minThreshold)
          ) {
            // Create or update stock alert
            const [alert] = await StockAlert.findOrCreate({
              where: { ingredientId: ingredient.id, resolved: false },
              defaults: {
                ingredientName: ingredient.name,
                currentStock: ingredient.stockQuantity,
                threshold: ingredient.minThreshold,
                alertType: "low",
              },
              transaction: t,
            });
            // Update current stock
            await alert.update(
              { currentStock: ingredient.stockQuantity },
              { transaction: t },
            );

            // Publish event (non-blocking)
            try {
              publishEvent("inventory.events", "stock.low", {
                ingredientId: ingredient.id,
                name: ingredient.name,
                currentStock: ingredient.stockQuantity,
                threshold: ingredient.minThreshold,
              });
            } catch (err) {
              logger.warn("Failed to publish stock low event", err);
            }
          }
        }
      }
      await t.commit();
      return { success: true, changes };
    } catch (error) {
      await t.rollback();
      return { success: false, reason: error.message };
    }
  }

  /**
   * Restore stock (when order cancelled).
   */
  async restoreStock(items, orderId) {
    const t = await sequelize.transaction();
    try {
      for (const item of items) {
        const recipe = await Recipe.findAll({
          where: { menuItemId: item.menuItemId },
          include: ["ingredient"],
          transaction: t,
        });
        for (const row of recipe) {
          const ingredient = row.ingredient;
          const amount = Number(row.quantityRequired) * item.quantity;
          ingredient.stockQuantity = Number(ingredient.stockQuantity) + amount;
          await ingredient.save({ transaction: t });

          await InventoryTransaction.create(
            {
              ingredientId: ingredient.id,
              orderId,
              changeAmount: amount,
              reason: `Restored from cancelled order ${orderId}`,
            },
            { transaction: t },
          );
        }
      }
      await t.commit();
      return { success: true };
    } catch (error) {
      await t.rollback();
      return { success: false, reason: error.message };
    }
  }

  async getAllIngredients() {
    return Ingredient.findAll();
  }

  async updateIngredient(id, data) {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) throw new NotFoundError("Ingredient");
    await ingredient.update(data);
    return ingredient;
  }
}

export default new InventoryService();
