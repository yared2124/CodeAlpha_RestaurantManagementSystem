/**
 * messaging.js – RabbitMQ wrapper for publishing/consuming events.
 */
import amqp from "amqplib";
import logger from "./logger.js";

let connection;
let channel;

export const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange("order.events", "topic", { durable: true });
      await channel.assertExchange("inventory.events", "topic", {
        durable: true,
      });
      logger.info("RabbitMQ connected");
      return channel;
    } catch (err) {
      retries--;
      logger.warn(`RabbitMQ connection failed, retries left: ${retries}`);
      if (retries === 0) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const publishEvent = (exchange, routingKey, data) => {
  if (!channel) {
    logger.warn("RabbitMQ channel not available, event not published");
    return;
  }
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), {
    persistent: true,
    contentType: "application/json",
  });
  logger.info(`Event published: ${routingKey}`);
};

export const consumeEvents = async (
  queueName,
  routingKeys,
  exchange,
  onMessage,
) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  await channel.assertQueue(queueName, { durable: true });
  for (const key of routingKeys) {
    await channel.bindQueue(queueName, exchange, key);
  }
  channel.consume(queueName, async (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString());
      await onMessage(content);
      channel.ack(msg);
    } catch (err) {
      logger.error("Consumer error", err);
      channel.nack(msg, false, false);
    }
  });
};
