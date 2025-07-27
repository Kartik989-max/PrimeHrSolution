import type { NextApiRequest, NextApiResponse } from 'next';
import { AdminData } from '@/types/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get admin credentials from environment variables
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // Check if environment variables are set
    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return res.status(500).json({ error: 'Admin authentication not configured' });
    }

    // Check admin credentials
    if (username === adminUsername && password === adminPassword) {
      // Create admin data object with proper typing
      const adminData: AdminData = {
        username: adminUsername,
        role: 'admin',
        lastLogin: new Date(),
        permissions: ['manage_jobs', 'manage_messages', 'view_analytics']
      };

      // Return success response
      res.status(200).json({ 
        message: 'Admin login successful',
        admin: adminData
      });
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid admin credentials' });
    }

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 