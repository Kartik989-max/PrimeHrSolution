import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    console.log('Starting resume URL fix process...');

    // Find all applications with Cloudinary URLs that have duplicate 'resumes' folder
    const applications = await JobApplication.find({
      resumeUrl: { $regex: /resumes\/resumes\// }
    });

    console.log(`Found ${applications.length} applications with duplicate folder paths`);

    let fixedCount = 0;
    const results = [];

    for (const application of applications) {
      try {
        // Fix the URL by removing the duplicate 'resumes/' prefix
        const originalUrl = application.resumeUrl;
        const fixedUrl = originalUrl.replace('/resumes/resumes/', '/resumes/');
        
        // Update the application
        await JobApplication.findByIdAndUpdate(application._id, {
          resumeUrl: fixedUrl
        });

        results.push({
          id: application._id,
          originalUrl,
          fixedUrl,
          status: 'fixed'
        });

        fixedCount++;
        console.log(`Fixed URL for application ${application._id}:`, originalUrl, '->', fixedUrl);
      } catch (error) {
        console.error(`Error fixing application ${application._id}:`, error);
        results.push({
          id: application._id,
          originalUrl: application.resumeUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'failed'
        });
      }
    }

    console.log(`Fixed ${fixedCount} out of ${applications.length} applications`);

    return res.status(200).json({
      message: `Fixed ${fixedCount} resume URLs`,
      totalFound: applications.length,
      fixedCount,
      results
    });

  } catch (error) {
    console.error('Error fixing resume URLs:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 