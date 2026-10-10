import { requireAdmin } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  bytes: number;
  format: string;
  created_at: string;
}

export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const configStatus = {
      cloudName: cloudName ? 'Set' : 'Missing',
      apiKey: apiKey ? 'Set' : 'Missing',
      apiSecret: apiSecret ? 'Set' : 'Missing',
      allConfigured: !!(cloudName && apiKey && apiSecret),
    };

    if (!configStatus.allConfigured) {
      return res.status(200).json({
        message: 'Cloudinary configuration incomplete',
        config: configStatus,
        instructions: 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file',
      });
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

    const result = await cloudinary.api.resources({ type: 'upload', prefix: 'resumes/', max_results: 10 });

    return res.status(200).json({
      message: 'Cloudinary configuration is working!',
      config: configStatus,
      uploads: {
        total: result.resources.length,
        files: result.resources.map((resource: CloudinaryResource) => ({
          name: resource.public_id,
          url: resource.secure_url,
          size: resource.bytes,
          format: resource.format,
          created: resource.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Cloudinary check error:', error);
    return res.status(500).json({
      message: 'Error checking Cloudinary configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
      },
    });
  }
});
