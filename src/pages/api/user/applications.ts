import { requireAuth } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default requireAuth(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Always use the authenticated user's ID; ignore any client-supplied userId (prevents IDOR).
    const userId = req.user.id;

    const applications = await JobApplication.find({ userId })
      .populate('jobId', 'title company location type postedAt')
      .sort({ appliedAt: -1 })
      .exec();

    const transformedApplications = applications.map((app) => ({
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
      notes: app.notes,
    }));

    return res.status(200).json({
      applications: transformedApplications,
      count: transformedApplications.length,
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
