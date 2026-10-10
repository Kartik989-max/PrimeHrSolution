import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
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

export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { page = '1', limit = '10', status, jobId, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: ApplicationFilter = {};

    if (status && status !== 'all' && typeof status === 'string') {
      filter.status = status;
    }

    if (jobId && jobId !== 'all' && typeof jobId === 'string') {
      filter.jobId = jobId;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const applications = await JobApplication.find(filter)
      .populate({ path: 'jobId', select: 'title company location type', options: { lean: true } })
      .populate({ path: 'userId', select: 'firstName lastName email', options: { lean: true } })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await JobApplication.countDocuments(filter);

    const transformedApplications = applications.map((app) => ({
      ...app.toObject(),
      jobId: app.jobId || null,
      userId: app.userId || null,
    }));

    const { default: Job } = await import('@/models/Job');
    const jobs = await Job.find({}, 'title company');

    const statusCounts = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
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
        limit: limitNum,
      },
      filters: {
        jobs,
        statusSummary,
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
