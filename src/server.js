import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import config from './config/index.js';
import logger from './shared/logger.js';

const PORT = config.port || 3002;

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Health endpoint: http://localhost:${PORT}/api/v1/health`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

function gracefulShutdown(server, signal) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('✅ HTTP server closed.');
    await disconnectDatabase();
    process.exit(0);
  });

  // Force close server after 30s
  setTimeout(() => {
    logger.error(
      '❌ Could not close connections in time, forcefully shutting down',
    );
    process.exit(1);
  }, 30000);
}

startServer();
