import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Job from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json({ 
      message: 'View count updated successfully', 
      viewCount: job.viewCount 
    });

  } catch (error) {
    console.error('Error updating view count:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 