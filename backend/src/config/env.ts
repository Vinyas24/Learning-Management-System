import dotenv from 'dotenv';
dotenv.config();

export const env = {
    // Server
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_NAME: process.env.DB_NAME || 'lms_db',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_SSL: process.env.DB_SSL === 'true',

    // JWT
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    JWT_ACCESS_EXPIRY: '15m',
    JWT_REFRESH_EXPIRY_DAYS: 30,

    // CORS & Cookies
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
};
