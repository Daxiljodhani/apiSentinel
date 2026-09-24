import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. Role '${req.user.role}' is not allowed to perform this action. Required: ${allowedRoles.join(', ')}`,
        },
      });
    }

    next();
  };
}
