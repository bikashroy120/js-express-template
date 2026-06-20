import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import logger from '../shared/logger.js';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('📊 Database connected successfully');

    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database connection verified');

    return prisma;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful disconnection
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('📊 Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Error disconnecting from database:', error.message);
  }
};

export default prisma;
