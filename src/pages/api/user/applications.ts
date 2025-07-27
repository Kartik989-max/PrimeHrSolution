import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';
import Job from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch applications with populated job details
    const applications = await JobApplication.find({ userId })
      .populate('jobId', 'title company location type postedAt')
      .sort({ appliedAt: -1 });

    // Transform the data to include job details
    const transformedApplications = applications.map(app => ({
      id: app._id,
      jobId: app.jobId._id,
      jobTitle: app.jobId.title,
      company: app.jobId.company,
      location: app.jobId.location,
      jobType: app.jobId.type,
      jobPostedAt: app.jobId.postedAt,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      status: app.status,
      appliedAt: app.appliedAt,
      reviewedAt: app.reviewedAt,
      notes: app.notes
    }));

    res.status(200).json({
      applications: transformedApplications,
      count: transformedApplications.length
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 