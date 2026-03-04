import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/security';

interface AccessTokenPayload {
    userId: number;
}

interface RefreshTokenPayload {
    userId: number;
    tokenId: string;
}

// Access token: 15 minutes in seconds
const ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60;
// Refresh token: 30 days in seconds
const REFRESH_TOKEN_EXPIRY_SECONDS = jwtConfig.refreshExpiryDays * 24 * 60 * 60;

export const signAccessToken = (userId: number): string => {
    const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS };
    return jwt.sign({ userId }, jwtConfig.accessSecret, options);
};

export const signRefreshToken = (userId: number, tokenId: string): string => {
    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY_SECONDS };
    return jwt.sign({ userId, tokenId }, jwtConfig.refreshSecret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, jwtConfig.accessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    return jwt.verify(token, jwtConfig.refreshSecret) as RefreshTokenPayload;
};
