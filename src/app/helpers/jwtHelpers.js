import jwt from 'jsonwebtoken';
import ApiError from '../../errors/ApiError.js';
import logger from '../../shared/logger.js';

export const createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw new ApiError('Invalid token');
  }
};
