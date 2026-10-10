import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { sendEmail, emailTemplates } from '@/utils/emailConfig';
import { rateLimitIp } from '@/lib/rateLimit';
import { forgotPasswordSchema, validateBody } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimitIp(req, 'forgot_password', { windowMs: 60_000, max: 5 })) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const body = validateBody(req, res, forgotPasswordSchema);
  if (!body) return;

  try {
    await dbConnect();

    const user = await User.findOne({ email: body.email }).exec();

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

      const emailContent = emailTemplates.passwordReset(user.firstName, resetUrl);
      await sendEmail({ to: user.email, subject: emailContent.subject, html: emailContent.html });
    }

    // Always return the same message to avoid user enumeration.
    return res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
