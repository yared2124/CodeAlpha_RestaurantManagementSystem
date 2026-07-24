import amqp from "amqplib";
import logger from "../logger/index.js";

let connection, channel;

/**
 * Establishes a persistent connection to RabbitMQ with retry logic.
 * In a distributed system, the message broker is a critical dependency.
 * Exponential backoff could be added for production resilience.
 */
export const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      // Declare exchanges upfront to avoid race conditions.
      // 'topic' exchanges allow flexible routing (e.g., order.*, inventory.updated).
      await channel.assertExchange("order.events", "topic", { durable: true });
      await channel.assertExchange("inventory.events", "topic", {
        durable: true,
      });

      logger.info("RabbitMQ connected");
      return channel;
    } catch (error) {
      retries -= 1;
      logger.warn(`RabbitMQ connection failed. Retries left: ${retries}`);
      if (retries === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Publish a message to an exchange with persistent delivery.
 * 'persistent: true' ensures messages survive broker restarts.
 */
export const publishEvent = (exchange, routingKey, data) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  const buffer = Buffer.from(JSON.stringify(data));
  channel.publish(exchange, routingKey, buffer, {
    persistent: true,
    contentType: "application/json",
    timestamp: Date.now(),
  });
  logger.info(`Event published: ${routingKey}`, { data });
};

/**
 * Consume messages with manual acknowledgment.
 * 'noAck: false' guarantees at‑least‑once delivery – crucial for inventory updates.
 * If processing fails, the message is NACKed and can be retried or sent to a DLQ.
 */
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
      await onMessage(content, msg);
      channel.ack(msg); // Acknowledge only after successful business logic.
    } catch (error) {
      logger.error("Consumer error", { error, raw: msg.content.toString() });
      // In production, we would NACK with 'requeue: false' and send to a Dead Letter Exchange
      // to avoid infinite retries on poison messages.
      channel.nack(msg, false, false);
    }
  });
};
