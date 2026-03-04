import { Request, Response, NextFunction } from 'express';
import { createApiError } from '../../middleware/errorHandler';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
    const { email, password, name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw createApiError('Name is required', 400);
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
        throw createApiError('A valid email is required', 400);
    }

    if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
        throw createApiError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
    }

    req.body.email = email.toLowerCase().trim();
    req.body.name = name.trim();
    next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
        throw createApiError('A valid email is required', 400);
    }

    if (!password || typeof password !== 'string') {
        throw createApiError('Password is required', 400);
    }

    req.body.email = email.toLowerCase().trim();
    next();
};
