import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, fallback) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
};

const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const nodeEnv = getEnv('NODE_ENV', 'development');
const isProduction = nodeEnv === 'production';

const config = {
  nodeEnv,
  port: Number(getEnv('PORT', 3000)),
  trustProxy: getEnv('TRUST_PROXY', '1') === '1',
  allowedOrigins: getEnv('ALLOWED_ORIGINS', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  logging: {
    level: getEnv('LOG_LEVEL', isProduction ? 'warn' : 'info'),
  },
  jwt: {
    accessTokenSecret: isProduction
      ? getRequiredEnv('JWT_ACCESS_SECRET')
      : getEnv('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
    refreshTokenSecret: isProduction
      ? getRequiredEnv('JWT_REFRESH_SECRET')
      : getEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
  },
  email: {
    host: getEnv('SMTP_HOST', ''),
    port: Number(getEnv('SMTP_PORT', 587)),
    secure: getEnv('SMTP_SECURE', 'false') === 'true',
    user: getEnv('SMTP_USER', ''),
    pass: getEnv('SMTP_PASS', ''),
    from: getEnv('SMTP_FROM', ''),
  },
};

export default config;
