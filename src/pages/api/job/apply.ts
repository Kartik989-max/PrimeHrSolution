import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';
import Job from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const {
      jobId,
      userId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter,
      resumeUrl,
      resumePublicId
    } = req.body;

    // Validation
    if (!jobId || !userId || !firstName || !lastName || !email || !phone || !resumeUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user has already applied for this job
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create the job application
    const jobApplication = await JobApplication.create({
      jobId,
      userId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter: coverLetter || '',
      resumeUrl,
      resumePublicId,
      status: 'pending',
      appliedAt: new Date()
    });

    // Increment the application count for the job
    await Job.findByIdAndUpdate(
      jobId,
      { $inc: { applicationCount: 1 } }
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application: jobApplication
    });

  } catch (error: any) {
    console.error('Job application error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    
    res.status(500).json({ error: 'Failed to submit application' });
  }
} 