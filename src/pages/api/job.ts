import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Job from '@/models/Job';
import { getServerSession } from '@/lib/auth';
import { jobSchema, validateBody } from '@/lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        await dbConnect();
        const jobs = await Job.find({}).sort({ postedAt: -1 });
        return res.status(200).json(jobs);
      } catch (error) {
        console.error('Job list error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    case 'POST': {
      const session = await getServerSession(req);
      if (!session) return res.status(401).json({ error: 'Authentication required' });
      if (session.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

      const body = validateBody(req, res, jobSchema);
      if (!body) return;

      try {
        await dbConnect();
        const job = await Job.create(body);
        return res.status(201).json({ message: 'Job created', job });
      } catch (error) {
        console.error('Job creation error:', error);
        return res.status(400).json({ error: 'Failed to create job' });
      }
    }
    default:
      return res.status(405).end();
  }
}
