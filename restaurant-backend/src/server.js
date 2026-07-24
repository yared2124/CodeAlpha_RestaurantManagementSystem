const app = require('./app');
const { sequelize } = require('./models');
const { connectRabbitMQ } = require('./utils/messaging');
const { startCronJobs } = require('./utils/cron');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Database connection
    await sequelize.authenticate();
    logger.info('Database connection established.');

    // Sync models (create tables if not exists)
    await sequelize.sync({ alter: true });
    logger.info('Database synced.');

    // RabbitMQ (optional)
    try {
      await connectRabbitMQ();
      logger.info('RabbitMQ connected.');
      // Start consumers
      require('./consumers');
    } catch (err) {
      logger.warn('RabbitMQ not available, continuing without async messaging');
    }

    // Start cron jobs
    startCronJobs();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Startup error:', err);
    process.exit(1);
  }
};

start();
