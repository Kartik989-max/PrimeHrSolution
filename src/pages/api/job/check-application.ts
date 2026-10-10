import { requireAuth } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default requireAuth(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { jobId } = req.query;
    const userId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const existingApplication = await JobApplication.findOne({ jobId, userId }).exec();

    return res.status(200).json({
      hasApplied: !!existingApplication,
      application: existingApplication
        ? { id: existingApplication._id, status: existingApplication.status, appliedAt: existingApplication.appliedAt }
        : null,
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
