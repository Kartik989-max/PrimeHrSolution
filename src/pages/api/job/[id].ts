import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Job from '@/models/Job';
import { getServerSession } from '@/lib/auth';
import { jobSchema, validateBody } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  const isMutating = req.method === 'PUT' || req.method === 'DELETE';

  if (isMutating) {
    const session = await getServerSession(req);
    if (!session) return res.status(401).json({ error: 'Authentication required' });
    if (session.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('DB connection error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        return res.status(200).json(job);
      } catch (error) {
        console.error('Job fetch error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    case 'PUT': {
      const body = validateBody(req, res, jobSchema);
      if (!body) return;
      try {
        const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
        return res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
      } catch (error) {
        console.error('Job update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    case 'DELETE': {
      try {
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) return res.status(404).json({ error: 'Job not found' });
        return res.status(200).json({ message: 'Job deleted successfully' });
      } catch (error) {
        console.error('Job deletion error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
