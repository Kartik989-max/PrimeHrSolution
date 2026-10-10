import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default requireAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const applications = await JobApplication.find({ resumeUrl: { $regex: /resumes\/resumes\// } }).exec();

    let fixedCount = 0;
    const results: Array<{ id: string; originalUrl: string; fixedUrl?: string; error?: string; status: string }> = [];

    for (const application of applications) {
      try {
        const originalUrl = application.resumeUrl;
        const fixedUrl = originalUrl.replace('/resumes/resumes/', '/resumes/');
        await JobApplication.findByIdAndUpdate(application._id, { resumeUrl: fixedUrl }).exec();
        results.push({ id: String(application._id), originalUrl, fixedUrl, status: 'fixed' });
        fixedCount++;
      } catch (error) {
        results.push({ id: String(application._id), originalUrl: application.resumeUrl, error: error instanceof Error ? error.message : 'Unknown error', status: 'failed' });
      }
    }

    return res.status(200).json({
      message: `Fixed ${fixedCount} resume URLs`,
      totalFound: applications.length,
      fixedCount,
      results,
    });
  } catch (error) {
    console.error('Error fixing resume URLs:', error);
    return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});
