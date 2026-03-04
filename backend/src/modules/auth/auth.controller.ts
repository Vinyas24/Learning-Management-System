import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { refreshCookieOptions } from '../../config/security';

const REFRESH_COOKIE_NAME = 'refresh_token';

// ── POST /api/auth/register ──────────────────────────────────────
export const registerHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);

        res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions);

        res.status(201).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── POST /api/auth/login ─────────────────────────────────────────
export const loginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions);

        res.status(200).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── POST /api/auth/refresh ───────────────────────────────────────
export const refreshHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                error: { message: 'No refresh token provided' },
            });
            return;
        }

        const result = await authService.refresh(refreshToken);

        res.status(200).json({
            success: true,
            accessToken: result.accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── POST /api/auth/logout ────────────────────────────────────────
export const logoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.clearCookie(REFRESH_COOKIE_NAME, {
            ...refreshCookieOptions,
            maxAge: 0,
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};
