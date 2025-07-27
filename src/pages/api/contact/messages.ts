import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import ContactMessage from '@/models/ContactMessage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Get all contact messages, sorted by creation date (newest first)
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json(messages);

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
} 