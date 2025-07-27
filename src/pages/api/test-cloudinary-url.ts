import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Testing Cloudinary URL:', url);

    // Test if the URL is accessible
    try {
      const response = await fetch(url as string, { method: 'HEAD' });
      console.log('URL response status:', response.status);
      console.log('URL response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        return res.status(200).json({
          success: true,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          message: 'URL is accessible'
        });
      } else {
        return res.status(400).json({
          success: false,
          status: response.status,
          message: 'URL is not accessible'
        });
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({
        success: false,
        error: 'Failed to test URL',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Test URL error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 