import { CorsOptions } from 'cors';
import { CookieOptions } from 'express';
import { env } from './env';

export const corsOptions: CorsOptions = {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
    path: '/api/auth',
    maxAge: env.JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 30 days in ms
};

export const jwtConfig = {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiry: env.JWT_ACCESS_EXPIRY,
    refreshExpiryDays: env.JWT_REFRESH_EXPIRY_DAYS,
};
