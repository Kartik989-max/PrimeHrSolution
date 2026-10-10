import { requireAdmin } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(400).json({ error: 'Missing Cloudinary credentials' });
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

    const result = await cloudinary.api.ping();

    return res.status(200).json({
      message: 'Cloudinary connection successful!',
      ping: result,
      credentials: {
        cloudName: cloudName,
        apiKey: apiKey ? 'Set' : 'Missing',
        apiSecret: apiSecret ? 'Set' : 'Missing',
      },
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    return res.status(500).json({ error: 'Cloudinary connection failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});
