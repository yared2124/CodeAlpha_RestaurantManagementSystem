/**
 * cron.js – scheduled jobs using node-cron.
 */
import cron from "node-cron";
import logger from "./logger.js";
import reportingService from "../services/reporting.service.js";
import inventoryService from "../services/inventory.service.js";

export const startCronJobs = () => {
  // Daily sales report at midnight
  cron.schedule("0 0 * * *", async () => {
    logger.info("Generating daily sales report...");
    // In a real implementation, we would aggregate yesterday's orders
    // and call reportingService.updateDailySales
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      // ... fetch orders and update
    } catch (err) {
      logger.error("Daily sales cron failed", err);
    }
  });

  // Check low stock alerts every hour
  cron.schedule("0 * * * *", async () => {
    logger.info("Checking low stock alerts...");
    try {
      const ingredients = await inventoryService.getAllIngredients();
      for (const ing of ingredients) {
        if (Number(ing.stockQuantity) < Number(ing.minThreshold)) {
          // Publish event or create alert
          logger.info(`Low stock: ${ing.name} (${ing.stockQuantity})`);
        }
      }
    } catch (err) {
      logger.error("Stock alert cron failed", err);
    }
  });

  logger.info("Cron jobs started");
};
