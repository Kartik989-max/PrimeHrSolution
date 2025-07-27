import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { jobId, userId } = req.query;
    
    if (!jobId || !userId) {
      return res.status(400).json({ error: 'Job ID and User ID are required' });
    }

    // Check if user has already applied for this job
    const existingApplication = await JobApplication.findOne({
      jobId: jobId,
      userId: userId
    });

    return res.status(200).json({
      hasApplied: !!existingApplication,
      application: existingApplication ? {
        id: existingApplication._id,
        status: existingApplication.status,
        appliedAt: existingApplication.appliedAt
      } : null
    });

  } catch (error) {
    console.error('Error checking application status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 