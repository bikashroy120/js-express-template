import dotenv from 'dotenv';

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your_jwt_secret',
    refreshTokenSecret:
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret',
  },
};

export default config;
