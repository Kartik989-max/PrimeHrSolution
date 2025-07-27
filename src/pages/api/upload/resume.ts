import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { NextApiRequestWithFile } from '@/types/upload';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

// Helper function to run multer middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the uploaded file
    await runMiddleware(req, res, upload.single('file'));

    const file = (req as NextApiRequestWithFile).file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('Cloudinary not configured, using mock response');
      
      // Get file extension from original filename
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
      
      // Get username from query parameters or request body
      const username = req.query.username || req.body?.username || 'anonymous';
      const sanitizedUsername = username.toString().replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      
      const timestamp = Date.now();
      const uniqueFileName = `${sanitizedUsername}_${timestamp}_${fileNameWithoutExt}`;
      
      // Fallback to mock response if Cloudinary is not configured
      const mockUploadResponse = {
        secure_url: `https://res.cloudinary.com/your-cloud-name/raw/upload/v1/resumes/${uniqueFileName}.${fileExtension}`,
        public_id: uniqueFileName,
        format: fileExtension,
        resource_type: 'raw'
      };

      return res.status(200).json({
        message: 'Resume uploaded successfully (mock)',
        url: mockUploadResponse.secure_url,
        public_id: mockUploadResponse.public_id
      });
    }

    console.log('Cloudinary credentials found, proceeding with upload');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');

    // Upload to Cloudinary
    console.log('Starting Cloudinary upload for file:', file.originalname);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.mimetype);
    
    // Get file extension from original filename
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
    
    // Get username from query parameters or request body
    const username = req.query.username || req.body?.username || 'anonymous';
    const sanitizedUsername = username.toString().replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    
    // Create a unique filename with username and timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${sanitizedUsername}_${timestamp}_${fileNameWithoutExt}`;
    const modifiedFileName = `${uniqueFileName}.${fileExtension}`;
    
    console.log('Original filename:', file.originalname);
    console.log('Username:', username);
    console.log('Sanitized username:', sanitizedUsername);
    console.log('File extension:', fileExtension);
    console.log('Unique filename:', uniqueFileName);
    console.log('Modified filename:', modifiedFileName);
    
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resumes',
          resource_type: 'raw',
          public_id: uniqueFileName, // Remove the 'resumes/' prefix since folder is already set
          format: fileExtension, // Preserve the original format
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload successful:', result);
            resolve(result);
          }
        }
      );

      // Write the file buffer to the upload stream
      uploadStream.end(file.buffer);
    });

    res.status(200).json({
      message: 'Resume uploaded successfully',
      url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id,
      format: fileExtension
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
      }
      if (error.message.includes('Invalid file type')) {
        return res.status(400).json({ error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' });
      }
    }
    
    res.status(500).json({ error: 'Failed to upload resume' });
  }
}

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}; 