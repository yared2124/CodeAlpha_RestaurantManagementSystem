/**
 * consumers/index.js – starts all event consumers.
 */
import logger from "../utils/logger.js";
import "./order-placed.consumer.js";
import "./order-cancelled.consumer.js";
import "./stock-low.consumer.js";

logger.info("All consumers registered");
