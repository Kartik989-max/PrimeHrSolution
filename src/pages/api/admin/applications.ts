import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
// Import all models to ensure they're registered
import '@/models/User';
import '@/models/Job';
import JobApplication from '@/models/JobApplication';

interface ApplicationFilter {
  status?: string;
  jobId?: string;
  $or?: Array<{
    firstName?: RegExp;
    lastName?: RegExp;
    email?: RegExp;
  }>;
}

interface StatusCount {
  _id: string;
  count: number;
}

interface StatusSummary {
  [key: string]: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { page = '1', limit = '10', status, jobId, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: ApplicationFilter = {};
    
    if (status && status !== 'all' && typeof status === 'string') {
      filter.status = status;
    }
    
    if (jobId && jobId !== 'all' && typeof jobId === 'string') {
      filter.jobId = jobId;
    }

    // Build search filter
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ];
    }

    // Get applications with populated job and user data
    const applications = await JobApplication.find(filter)
      .populate({
        path: 'jobId',
        select: 'title company location type',
        // Handle cases where job might have been deleted
        options: { lean: true }
      })
      .populate({
        path: 'userId',
        select: 'firstName lastName email',
        // Handle cases where user might have been deleted
        options: { lean: true }
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await JobApplication.countDocuments(filter);

    // Transform applications to handle null populated fields
    const transformedApplications = applications.map(app => ({
      ...app.toObject(),
      jobId: app.jobId || null,
      userId: app.userId || null
    }));

    // Get all jobs for filter dropdown
    const { default: Job } = await import('@/models/Job');
    const jobs = await Job.find({}, 'title company');

    // Get status counts for summary
    const statusCounts = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusSummary = statusCounts.reduce((acc: StatusSummary, curr: StatusCount) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as StatusSummary);

    return res.status(200).json({
      applications: transformedApplications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      },
      filters: {
        jobs,
        statusSummary
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 