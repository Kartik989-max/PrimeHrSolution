import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Testing Cloudinary credentials:');
    console.log('Cloud Name:', cloudName);
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('API Secret:', apiSecret ? 'Present' : 'Missing');

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(400).json({
        error: 'Missing Cloudinary credentials',
        missing: {
          cloudName: !cloudName,
          apiKey: !apiKey,
          apiSecret: !apiSecret
        }
      });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test with a simple API call
    const result = await cloudinary.api.ping();

    res.status(200).json({
      message: 'Cloudinary connection successful!',
      ping: result,
      credentials: {
        cloudName: cloudName,
        apiKey: apiKey ? 'Present' : 'Missing',
        apiSecret: apiSecret ? 'Present' : 'Missing'
      }
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({
      error: 'Cloudinary connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 