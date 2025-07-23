import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Job from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'POST') {
    const { title, description, location, type, company, requirements } = req.body;
    if (!title || !description || !location || !type || !company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const job = await Job.create({ title, description, location, type, company, requirements });
      return res.status(201).json({ message: 'Job created', job });
    } catch {
      return res.status(400).json({ error: 'Failed to create job' });
    }
  } else if (req.method === 'GET') {
    const jobs = await Job.find({}).sort({ postedAt: -1 });
    return res.status(200).json(jobs);
  } else {
    return res.status(405).end();
  }
} 