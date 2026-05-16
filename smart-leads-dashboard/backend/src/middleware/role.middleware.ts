import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';
import { sendError } from '../utils/apiResponse.utils';

/**
 * RBAC middleware factory — returns a middleware that only permits requests
 * from users whose role is included in the `allowedRoles` list.
 *
 * Usage: router.delete('/:id', authenticate, requireRole('admin'), deleteLeadHandler)
 *
 * @param allowedRoles One or more roles permitted to access the route
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // req.user is guaranteed to exist here because authenticate runs first.
    // If it somehow doesn't, return 401 rather than crashing.
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
