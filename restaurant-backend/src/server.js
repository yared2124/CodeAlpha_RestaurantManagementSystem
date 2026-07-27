import app from "./app.js";
import { sequelize } from "./models/index.js";
import { connectRabbitMQ } from "./utils/messaging.js";
import { startCronJobs } from "./utils/cron.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Test database connection
    await sequelize.authenticate();
    logger.info("Database connection established.");

    // 2. Sync models with database (create tables if they don't exist)
    //    In production, use migrations instead of `alter: true`.
    await sequelize.sync({ alter: true });
    logger.info("Database synced.");

    // 3. Connect to RabbitMQ (optional – if fails, we continue without messaging)
    try {
      await connectRabbitMQ();
      logger.info("RabbitMQ connected.");
      // Start event consumers (they will wait for messages)
      await import("./consumers/index.js");
    } catch (err) {
      logger.warn(
        "RabbitMQ not available, continuing without async messaging.",
      );
    }

    // 4. Start cron jobs for daily reports and stock alerts
    startCronJobs();

    // 5. Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Fatal error during startup:", err);
    process.exit(1);
  }
}

startServer();
