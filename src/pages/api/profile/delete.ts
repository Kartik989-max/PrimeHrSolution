import { requireAuth } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import JobApplication from '@/models/JobApplication';
import bcrypt from 'bcryptjs';
import { clearAuthCookies } from '@/lib/cookies';

export default requireAuth(async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required to delete account' });
  }

  try {
    await dbConnect();

    const userId = req.user.id;

    const user = await User.findById(userId).select('+password').exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    await Promise.all([
      User.findByIdAndDelete(userId).exec(),
      JobApplication.deleteMany({ userId }).exec(),
    ]);

    clearAuthCookies(res);
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
