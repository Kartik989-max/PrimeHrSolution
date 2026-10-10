import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import ContactMessage from '@/models/ContactMessage';

export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).select('-__v').exec();
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
