import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { UserRole } from '../types/auth.types';

/**
 * Factory middleware — creates a role guard for the specified roles.
 * Usage: authorizeRoles('Admin')
 */
const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Requires role: ${roles.join(' or ')}.`,
          403
        )
      );
    }

    next();
  };

export default authorizeRoles;
