import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';
import { getRefreshTokenFromReq, setAuthCookies } from '@/lib/cookies';
import { rateLimitIp } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'refresh', { windowMs: 60_000, max: 30 })) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const refreshToken = getRefreshTokenFromReq(req);
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  const accessToken = signAccessToken({
    id: payload.id,
    email: '',
    role: payload.id === 'admin' ? 'admin' : 'user',
    firstName: '',
  });
  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: 'Token refreshed' });
}
