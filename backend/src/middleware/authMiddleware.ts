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

        req.user = { id: payload.userId };
        next();
    } catch (error: any) {
        if (error.statusCode === 401) {
            next(error);
        } else {
            next(createApiError('Invalid or expired access token', 401));
        }
    }
};
