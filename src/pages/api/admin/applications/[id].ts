import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default requireAdmin(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { id } = req.query;
    const status = req.body?.status;
    const notes = req.body?.notes;

    if (!id) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status, reviewedAt: new Date(), ...(notes !== undefined ? { notes } : {}) },
      { new: true },
    )
      .populate('jobId', 'title company location type')
      .populate('userId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
