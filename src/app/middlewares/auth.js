import config from '../../config/index.js';
import ApiError from '../../errors/ApiError.js';
import { verifyToken } from '../helpers/jwtHelpers.js';

const auth =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, 'Unauthorized: No token provided');
      }

      const token = authHeader.slice(7).trim();

      if (!token) {
        throw new ApiError(401, 'Unauthorized: No token provided');
      }

      let decoded;
      try {
        decoded = verifyToken(token, config.jwt.accessTokenSecret);
      } catch {
        throw new ApiError(401, 'Session expired. Please login again.');
      }

      if (!decoded) {
        throw new ApiError(401, 'Session expired. Please login again.');
      }

      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        throw new ApiError(
          403,
          'Forbidden: You do not have access to this resource',
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };

export default auth;
