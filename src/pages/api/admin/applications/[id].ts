import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { id } = req.query;
    const { status, notes } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const updateData: any = { 
      status,
      reviewedAt: new Date()
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('jobId', 'title company location type')
     .populate('userId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.status(200).json({ 
      message: 'Application status updated successfully',
      application 
    });

  } catch (error) {
    console.error('Error updating application:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 