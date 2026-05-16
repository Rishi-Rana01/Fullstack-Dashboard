import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';
import { sendError } from '../utils/apiResponse.utils';


export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Not authenticated.');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        403,
        `Access denied. Required role(s): ${allowedRoles.join(', ')}.`
      );
      return;
    }

    next();
  };
};
