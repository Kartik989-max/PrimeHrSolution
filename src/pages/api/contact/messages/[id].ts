import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import ContactMessage from '@/models/ContactMessage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const message = await ContactMessage.findById(id);
        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }
        return res.status(200).json(message);

      case 'DELETE':
        const deletedMessage = await ContactMessage.findByIdAndDelete(id);
        if (!deletedMessage) {
          return res.status(404).json({ error: 'Message not found' });
        }
        return res.status(200).json({ message: 'Message deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Contact message API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 