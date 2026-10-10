import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const application = await JobApplication.findById(id).select('resumeUrl').exec();

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!application.resumeUrl) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Cache-Control', 'no-cache');

    if (application.resumeUrl.includes('cloudinary.com')) {
      const downloadUrl = application.resumeUrl.includes('?')
        ? `${application.resumeUrl}&fl_attachment`
        : `${application.resumeUrl}?fl_attachment`;
      return res.redirect(downloadUrl);
    }

    return res.redirect(application.resumeUrl);
  } catch (error) {
    console.error('Error serving resume:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
