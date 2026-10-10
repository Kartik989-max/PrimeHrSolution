import type { NextApiRequest, NextApiResponse } from 'next';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';
import { rateLimitIp } from '@/lib/rateLimit';
import { adminLoginSchema, validateBody } from '@/lib/validation';
import { AdminData } from '@/types/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'admin_login', { windowMs: 60_000, max: 10 })) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  const body = validateBody(req, res, adminLoginSchema);
  if (!body) return;

  // Prefer non-public env vars; fall back to legacy NEXT_PUBLIC_ vars for compatibility.
  const adminUsername = process.env.ADMIN_USERNAME || process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not configured in environment variables');
    return res.status(500).json({ error: 'Admin authentication not configured' });
  }

  const usernameMatch = body.username === adminUsername;
  const passwordMatch = body.password === adminPassword;

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const adminData: AdminData = {
    username: adminUsername,
    role: 'admin',
    lastLogin: new Date(),
    permissions: ['manage_jobs', 'manage_messages', 'view_analytics'],
  };

  const accessToken = signAccessToken({
    id: 'admin',
    email: adminUsername,
    role: 'admin',
    firstName: adminUsername,
  });
  const refreshToken = signRefreshToken({ id: 'admin' });
  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    message: 'Admin login successful',
    admin: adminData,
  });
}
