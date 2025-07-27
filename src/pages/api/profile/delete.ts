import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    // For now, we'll use a mock user ID - replace with actual session user ID
    const userId = req.headers['user-id'] || 'mock-user-id';

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // Delete user account
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Failed to delete account' });
    }

    // You might also want to delete related data (job applications, etc.)
    // For example:
    // await JobApplication.deleteMany({ userId });
    // await ContactMessage.deleteMany({ userId });

    res.status(200).json({ 
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 