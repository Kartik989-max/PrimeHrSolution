import { requireAuth } from '@/lib/auth';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';
import Job from '@/models/Job';
import { sendEmail, emailTemplates } from '@/utils/emailConfig';
import { applySchema, validateBody } from '@/lib/validation';

export default requireAuth(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = validateBody(req, res, applySchema);
  if (!body) return;

  try {
    await dbConnect();

    const { jobId } = body;

    const job = await Job.findById(jobId).exec();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const userId = req.user.id;

    const existingApplication = await JobApplication.findOne({ jobId, userId }).exec();
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const jobApplication = await JobApplication.create({
      jobId,
      userId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      coverLetter: body.coverLetter || '',
      resumeUrl: body.resumeUrl,
      resumePublicId: body.resumePublicId,
      status: 'pending',
      appliedAt: new Date(),
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } }).exec();

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      if (adminEmail) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const viewApplicationUrl = `${baseUrl}/admin/dashboard/applications?jobId=${jobId}`;
        const emailData = {
          applicantName: `${body.firstName} ${body.lastName}`,
          applicantEmail: body.email,
          applicantPhone: body.phone,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          appliedAt: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          viewApplicationUrl,
        };
        const emailTemplate = emailTemplates.newApplicationNotification(emailData);
        await sendEmail({ to: adminEmail, subject: emailTemplate.subject, html: emailTemplate.html });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    return res.status(201).json({
      message: 'Application submitted successfully',
      application: jobApplication,
    });
  } catch (error: unknown) {
    console.error('Job application error:', error);
    const code = (error as { code?: number }).code;
    if (code === 11000) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    return res.status(500).json({ error: 'Failed to submit application. Please try again later.' });
  }
});
