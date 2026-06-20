import { ZodError } from 'zod';
import ApiError from '../../errors/ApiError.js';

const handlePrismaError = (error) => {
  const { code } = error;

  switch (code) {
    case 'P2002': {
      const field = error.meta?.target?.[0] || 'field';
      return new ApiError(
        409,
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      );
    }
    case 'P2025':
      return new ApiError(404, 'Record not found');
    case 'P2003':
      return new ApiError(
        400,
        'Foreign key constraint failed (Related record not found)',
      );
    case 'P2014':
      return new ApiError(
        400,
        'Required relation missing or relational constraint violated',
      );
    case 'P2021':
      return new ApiError(500, 'Database table does not exist');
    case 'P2022':
      return new ApiError(500, 'Database column does not exist');
    default:
      return new ApiError(500, 'Database operation failed');
  }
};

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorMessages = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err.errors || [];
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = err.issues.map((issue) => {
      let customMessage = issue.message;
      if (issue.message.includes('expected string, received undefined')) {
        customMessage = `${issue.path[issue.path.length - 1]} is required`;
      }

      return {
        path: issue.path[issue.path.length - 1],
        message: customMessage,
      };
    });
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    errorMessages = [
      {
        path: 'token',
        message: err.message,
      },
    ];
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
    errorMessages = [
      {
        path: 'token',
        message: 'JWT expired',
      },
    ];
  } else if (err.code && err.clientVersion) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
