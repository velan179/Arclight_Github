const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const startServer = async () => {
  // Connect to Database (graceful on initial local setup)
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`ResolveFlow Backend Server running on port ${env.PORT} (${env.NODE_ENV})`);
    logger.info(`Health check available at: http://localhost:${env.PORT}/api/health`);
  });

  const handleShutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
