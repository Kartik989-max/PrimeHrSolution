import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  bytes: number;
  format: string;
  created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Cloudinary credentials are set
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const configStatus = {
      cloudName: cloudName ? '✅ Set' : '❌ Missing',
      apiKey: apiKey ? '✅ Set' : '❌ Missing',
      apiSecret: apiSecret ? '✅ Set' : '❌ Missing',
      allConfigured: !!(cloudName && apiKey && apiSecret)
    };

    if (!configStatus.allConfigured) {
      return res.status(200).json({
        message: 'Cloudinary configuration incomplete',
        config: configStatus,
        instructions: 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file'
      });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test Cloudinary connection by listing resources
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'resumes/',
      max_results: 10
    });

    res.status(200).json({
      message: 'Cloudinary configuration is working!',
      config: configStatus,
      uploads: {
        total: result.resources.length,
        files: result.resources.map((resource: CloudinaryResource) => ({
          name: resource.public_id,
          url: resource.secure_url,
          size: resource.bytes,
          format: resource.format,
          created: resource.created_at
        }))
      }
    });

  } catch (error) {
    console.error('Cloudinary check error:', error);
    res.status(500).json({
      message: 'Error checking Cloudinary configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
        apiKey: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
      }
    });
  }
} 