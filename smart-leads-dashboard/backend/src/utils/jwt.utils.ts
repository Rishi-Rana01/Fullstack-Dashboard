import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user.types';

// ── JWT Payload Shape ──────────────────────────────────────────────────────
// This is what gets encoded into the token and decoded on verification.
export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
}

// Read secrets from environment — never hardcode
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return secret;
};

const getJwtExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN ?? '7d';
};

/**
 * Signs a JWT token with the user's id, role, and email.
 * @param payload The data to encode into the token
 * @returns Signed JWT string
 */
export const signToken = (payload: JwtPayload): string => {
  // Using type assertion because jwt.sign's options type and StringValue don't always align
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  } as jwt.SignOptions);
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 * @param token Raw JWT string
 * @returns Decoded JwtPayload
 */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret());
  // jwt.verify returns string | JwtPayload — we need the object form
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as JwtPayload;
};
