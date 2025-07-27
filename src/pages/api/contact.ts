import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import ContactMessage from '@/models/ContactMessage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { 
      name, 
      email, 
      phone, 
      company, 
      country, 
      industry, 
      service, 
      message 
    } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Create contact message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      country: country || '',
      industry: industry || '',
      service: service || '',
      message,
      createdAt: new Date()
    });

    res.status(201).json({ 
      message: 'Message sent successfully! We\'ll get back to you soon.',
      contactMessage 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
} 