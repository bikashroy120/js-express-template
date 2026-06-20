import ApiError from './ApiError.js';

const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return new ApiError(401, 'Token expired');
  }

  return new ApiError(401, 'Authentication failed');
};

export default handleJWTError;
