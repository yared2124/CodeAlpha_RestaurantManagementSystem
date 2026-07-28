import { consumeEvents } from "../utils/messaging.js";
import logger from "../utils/logger.js";

export const start = async () => {
  await consumeEvents(
    "stock.low.queue",
    ["stock.low"],
    "inventory.events",
    async (payload) => {
      logger.info("Stock low alert", payload);
      // Here you could send email/slack notifications, create a task, etc.
    },
  );
};

start().catch((err) => logger.error("Failed to start stock-low consumer", err));
