import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.utils';
import { sendError } from '../utils/apiResponse.utils';

/**
 * Authentication middleware — validates the Bearer JWT from the Authorization header.
 * Attaches the decoded payload to req.user for downstream middleware/controllers.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Require the Authorization header with Bearer scheme
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'Access denied. No authentication token provided.');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      sendError(res, 401, 'Access denied. Token is malformed.');
      return;
    }

    // verifyToken throws if the token is invalid or expired
    const decoded: JwtPayload = verifyToken(token);

    // Attach the authenticated user info to the request for downstream use
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    const err = error as Error;

    // Differentiate expired tokens from invalid ones for better UX messaging
    if (err.name === 'TokenExpiredError') {
      sendError(res, 401, 'Session expired. Please log in again.');
    } else if (err.name === 'JsonWebTokenError') {
      sendError(res, 401, 'Invalid authentication token.');
    } else {
      sendError(res, 401, 'Authentication failed.');
    }
  }
};
