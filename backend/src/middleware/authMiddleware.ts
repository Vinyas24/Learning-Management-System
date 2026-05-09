import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { createApiError } from './errorHandler';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createApiError('Access token is required', 401);
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);

        req.user = { id: payload.userId, role: payload.role as 'student' | 'instructor' | 'admin' };
        next();
    } catch (error: any) {
        if (error.statusCode === 401) {
            next(error);
        } else {
            next(createApiError('Invalid or expired access token', 401));
        }
    }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(createApiError('Authentication required', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(createApiError('Forbidden: Insufficient permissions', 403));
        }

        next();
    };
};
