import { requireAuth } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { updateProfileSchema, validateBody } from '@/lib/validation';

export default requireAuth(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = validateBody(req, res, updateProfileSchema);
  if (!body) return;

  try {
    await dbConnect();

    const userId = req.user.id;

    const existingUser = await User.findOne({ email: body.email, _id: { $ne: userId } }).exec();
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName: body.firstName, lastName: body.lastName, email: body.email, phone: body.phone || '', updatedAt: new Date() },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: String(updatedUser._id),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
