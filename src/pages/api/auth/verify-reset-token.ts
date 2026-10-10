import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { rateLimitIp } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'verify_reset_token', { windowMs: 60_000, max: 30 })) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } }).exec();
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Verify reset token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
