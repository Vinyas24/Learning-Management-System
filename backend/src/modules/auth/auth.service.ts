import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import db from '../../config/db';
import { env } from '../../config/env';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { createApiError } from '../../middleware/errorHandler';

// Hash the refresh token for DB storage (never store raw tokens)
const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

interface AuthResult {
    user: { id: number; name: string; email: string };
    accessToken: string;
    refreshToken: string;
}

// ── Register ─────────────────────────────────────────────────────
export const register = async (
    email: string,
    password: string,
    name: string
): Promise<AuthResult> => {
    // Check if email already exists
    const existing = await db('users').where({ email }).first();
    if (existing) {
        throw createApiError('Email is already registered', 409);
    }

    const password_hash = await hashPassword(password);

    const [userId] = await db('users').insert({
        email,
        password_hash,
        name,
    });

    // Issue tokens
    const tokenId = uuidv4();
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId, tokenId);

    // Store refresh token hash in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

    await db('refresh_tokens').insert({
        user_id: userId,
        token_hash: hashToken(refreshToken),
        expires_at: expiresAt,
    });

    return {
        user: { id: userId, name, email },
        accessToken,
        refreshToken,
    };
};

// ── Login ────────────────────────────────────────────────────────
export const login = async (
    email: string,
    password: string
): Promise<AuthResult> => {
    const user = await db('users').where({ email }).first();
    if (!user) {
        throw createApiError('Invalid email or password', 401);
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
        throw createApiError('Invalid email or password', 401);
    }

    const tokenId = uuidv4();
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id, tokenId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

    await db('refresh_tokens').insert({
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: expiresAt,
    });

    return {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
    };
};

// ── Refresh ──────────────────────────────────────────────────────
export const refresh = async (
    refreshTokenRaw: string
): Promise<{ accessToken: string }> => {
    let payload;
    try {
        payload = verifyRefreshToken(refreshTokenRaw);
    } catch {
        throw createApiError('Invalid or expired refresh token', 401);
    }

    const tokenHash = hashToken(refreshTokenRaw);

    const tokenRow = await db('refresh_tokens')
        .where({ user_id: payload.userId, token_hash: tokenHash })
        .whereNull('revoked_at')
        .where('expires_at', '>', new Date())
        .first();

    if (!tokenRow) {
        throw createApiError('Refresh token is revoked or expired', 401);
    }

    const accessToken = signAccessToken(payload.userId);
    return { accessToken };
};

// ── Logout ───────────────────────────────────────────────────────
export const logout = async (refreshTokenRaw: string): Promise<void> => {
    let payload;
    try {
        payload = verifyRefreshToken(refreshTokenRaw);
    } catch {
        // Token already invalid — still clear it
        return;
    }

    const tokenHash = hashToken(refreshTokenRaw);

    await db('refresh_tokens')
        .where({ user_id: payload.userId, token_hash: tokenHash })
        .update({ revoked_at: new Date() });
};
