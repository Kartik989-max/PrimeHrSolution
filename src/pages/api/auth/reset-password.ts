import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { rateLimitIp } from '@/lib/rateLimit';
import { resetPasswordSchema, validateBody } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'reset_password', { windowMs: 60_000, max: 10 })) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const body = validateBody(req, res, resetPasswordSchema);
  if (!body) return;

  if (body.password !== body.confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ resetToken: body.token, resetTokenExpiry: { $gt: new Date() } }).exec();
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
