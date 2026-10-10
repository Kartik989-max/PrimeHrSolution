import type { NextApiResponse } from 'next';

export const ACCESS_TOKEN_COOKIE = 'auth_access_token';
export const REFRESH_TOKEN_COOKIE = 'auth_refresh_token';

const isProd = process.env.NODE_ENV === 'production';

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
  expires?: Date;
}

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  const { path = '/', httpOnly, secure, sameSite, maxAge, expires } = options;
  cookieStr += `; Path=${path}`;
  if (httpOnly) cookieStr += '; HttpOnly';
  if (secure) cookieStr += '; Secure';
  if (sameSite) cookieStr += `; SameSite=${sameSite}`;
  if (maxAge != null) cookieStr += `; Max-Age=${maxAge}`;
  if (expires) cookieStr += `; Expires=${expires.toUTCString()}`;
  return cookieStr;
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc: Record<string, string>, part) => {
    const idx = part.indexOf('=');
    if (idx > -1) {
      const key = decodeURIComponent(part.slice(0, idx).trim());
      const val = decodeURIComponent(part.slice(idx + 1).trim());
      if (key) acc[key] = val;
    }
    return acc;
  }, {});
}

function appendCookie(res: NextApiResponse, serialized: string) {
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    res.setHeader('Set-Cookie', [...(Array.isArray(existing) ? existing : [String(existing)]), serialized]);
  } else {
    res.setHeader('Set-Cookie', serialized);
  }
}

export function setAuthCookies(res: NextApiResponse, accessToken: string, refreshToken: string) {
  appendCookie(
    res,
    serializeCookie(ACCESS_TOKEN_COOKIE, accessToken, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 15 })
  );
  appendCookie(
    res,
    serializeCookie(REFRESH_TOKEN_COOKIE, refreshToken, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
  );
}

export function clearAuthCookies(res: NextApiResponse) {
  appendCookie(
    res,
    serializeCookie(ACCESS_TOKEN_COOKIE, '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 0, expires: new Date(0) })
  );
  appendCookie(
    res,
    serializeCookie(REFRESH_TOKEN_COOKIE, '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 0, expires: new Date(0) })
  );
}

export function getAccessTokenFromReq(req: { headers: { cookie?: string } }): string | undefined {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[ACCESS_TOKEN_COOKIE];
}

export function getRefreshTokenFromReq(req: { headers: { cookie?: string } }): string | undefined {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[REFRESH_TOKEN_COOKIE];
}
