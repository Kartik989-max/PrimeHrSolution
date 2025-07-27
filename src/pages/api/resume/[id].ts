import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    console.log('Resume download requested for application ID:', id);

    // Find the application by ID
    const application = await JobApplication.findById(id);
    
    if (!application) {
      console.log('Application not found for ID:', id);
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if resume URL exists
    if (!application.resumeUrl) {
      console.log('No resume URL found for application:', id);
      return res.status(404).json({ error: 'Resume not found' });
    }

    console.log('Resume URL found:', application.resumeUrl);

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Cache-Control', 'no-cache');

    // If it's a Cloudinary URL, redirect to it
    if (application.resumeUrl.includes('cloudinary.com')) {
      console.log('Redirecting to Cloudinary URL:', application.resumeUrl);
      
      // For Cloudinary URLs, we can also try to force download by adding fl_attachment parameter
      const downloadUrl = application.resumeUrl.includes('?') 
        ? `${application.resumeUrl}&fl_attachment`
        : `${application.resumeUrl}?fl_attachment`;
      
      return res.redirect(downloadUrl);
    }

    // If it's a local file or other URL, redirect to it
    console.log('Redirecting to external URL');
    return res.redirect(application.resumeUrl);

  } catch (error) {
    console.error('Error serving resume:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 