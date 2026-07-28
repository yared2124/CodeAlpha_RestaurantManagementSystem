import { consumeEvents } from "../utils/messaging.js";
import inventoryService from "../services/inventory.service.js";
import tableService from "../services/table.service.js";
import logger from "../utils/logger.js";

export const start = async () => {
  await consumeEvents(
    "order.cancelled.queue",
    ["order.cancelled"],
    "order.events",
    async (payload) => {
      logger.info("Received OrderCancelled event", payload);
      // 1. Restore inventory
      await inventoryService.restoreStock(payload.items, payload.orderId);
      // 2. Free table if dine-in
      if (payload.tableId) {
        await tableService.freeTable(payload.tableId);
      }
      logger.info("Order cancellation processed", { orderId: payload.orderId });
    },
  );
};

start().catch((err) =>
  logger.error("Failed to start order-cancelled consumer", err),
);
