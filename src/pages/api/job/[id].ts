import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Job from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const job = await Job.findById(id);
        if (!job) {
          return res.status(404).json({ error: 'Job not found' });
        }
        return res.status(200).json(job);

      case 'PUT':
        const { title, description, location, type, company, requirements } = req.body;
        if (!title || !description || !location || !type || !company) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const updatedJob = await Job.findByIdAndUpdate(
          id,
          { title, description, location, type, company, requirements },
          { new: true, runValidators: true }
        );
        
        if (!updatedJob) {
          return res.status(404).json({ error: 'Job not found' });
        }
        
        return res.status(200).json({ message: 'Job updated successfully', job: updatedJob });

      case 'DELETE':
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
          return res.status(404).json({ error: 'Job not found' });
        }
        return res.status(200).json({ message: 'Job deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Job API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 