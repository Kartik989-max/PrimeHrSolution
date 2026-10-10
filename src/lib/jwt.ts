import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

export interface AccessPayload {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName?: string;
}

export interface RefreshPayload {
  id: string;
}

function requireSecret(): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return JWT_SECRET;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, requireSecret(), { expiresIn: ACCESS_TOKEN_EXPIRES });
}

export function signRefreshToken(payload: RefreshPayload): string {
  return jwt.sign(payload, requireSecret(), { expiresIn: REFRESH_TOKEN_EXPIRES });
}

export function verifyAccessToken(token: string): AccessPayload | null {
  try {
    return jwt.verify(token, requireSecret()) as AccessPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    return jwt.verify(token, requireSecret()) as RefreshPayload;
  } catch {
    return null;
  }
}
