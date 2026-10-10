import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req);
  if (!session) {
    return res.status(401).json({ user: null });
  }

  res.status(200).json({
    user: {
      id: session.id,
      firstName: session.firstName,
      lastName: session.lastName,
      email: session.email,
      role: session.role,
    },
  });
}
