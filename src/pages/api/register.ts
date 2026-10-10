import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';
import { rateLimitIp } from '@/lib/rateLimit';
import { registerSchema, validateBody } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'register', { windowMs: 60_000, max: 5 })) {
    return res.status(429).json({ error: 'Too many registration attempts. Please try again later.' });
  }

  const body = validateBody(req, res, registerSchema);
  if (!body) return;

  if (body.password !== body.confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email: body.email }).exec();
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || '',
      password: hashedPassword,
      role: 'user',
    });

    const accessPayload = {
      id: String(user._id),
      email: user.email,
      role: 'user',
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = signRefreshToken({ id: String(user._id) });
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: String(user._id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: 'user',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
