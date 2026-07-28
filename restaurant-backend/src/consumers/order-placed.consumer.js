import { consumeEvents } from "../utils/messaging.js";
import inventoryService from "../services/inventory.service.js";
import tableService from "../services/table.service.js";
import logger from "../utils/logger.js";

export const start = async () => {
  await consumeEvents(
    "order.placed.queue",
    ["order.placed"],
    "order.events",
    async (payload) => {
      logger.info("Received OrderPlaced event", payload);
      // 1. Deduct inventory
      const result = await inventoryService.deductStock(
        payload.items,
        payload.orderId,
      );
      if (!result.success) {
        logger.error("Inventory deduction failed", {
          orderId: payload.orderId,
          reason: result.reason,
        });
        // Publish compensation event (order.failed) – could be implemented
        // publishEvent('order.events', 'order.failed', { orderId: payload.orderId, reason: result.reason });
        return;
      }
      // 2. If dine-in, occupy table
      if (payload.tableId) {
        await tableService.occupyTable(payload.tableId, payload.orderId);
      }
      logger.info("Order placed processed successfully", {
        orderId: payload.orderId,
      });
    },
  );
};

// Auto-start if this module is imported
start().catch((err) =>
  logger.error("Failed to start order-placed consumer", err),
);
