import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import ContactMessage from '@/models/ContactMessage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message saved' });
  } catch {
    res.status(400).json({ error: 'Failed to save message' });
  }
} 