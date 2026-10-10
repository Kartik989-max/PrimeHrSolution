import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';
import { rateLimitIp } from '@/lib/rateLimit';
import { loginSchema, validateBody } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'login', { windowMs: 60_000, max: 10 })) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  const body = validateBody(req, res, loginSchema);
  if (!body) return;

  try {
    await dbConnect();

    const user = await User.findOne({ email: body.email }).select('+password').exec();
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessPayload = {
      id: String(user._id),
      email: user.email,
      role: (user as { role?: string }).role || 'user',
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = signRefreshToken({ id: String(user._id) });
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: String(user._id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: accessPayload.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
