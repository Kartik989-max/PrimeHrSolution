import { requireAuth } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { changePasswordSchema, validateBody } from '@/lib/validation';

export default requireAuth(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = validateBody(req, res, changePasswordSchema);
  if (!body) return;

  if (body.newPassword !== body.confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  try {
    await dbConnect();

    const userId = req.user.id;

    const user = await User.findById(userId).select('+password').exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(body.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(body.newPassword, 12);

    await User.findByIdAndUpdate(userId, { password: hashedNewPassword, updatedAt: new Date() }).exec();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
