import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { verifyAccessToken } from './jwt';
import { getAccessTokenFromReq, clearAuthCookies } from './cookies';

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export type AuthedHandler = (
  req: NextApiRequest & { user: SessionUser },
  res: NextApiResponse
) => Promise<unknown> | unknown;

export async function getServerSession(req: NextApiRequest): Promise<SessionUser | null> {
  const token = getAccessTokenFromReq(req);
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  // Admin sessions are env-backed (no DB user row); trust the signed token.
  if (payload.role === 'admin') {
    return {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName || '',
      role: 'admin',
    };
  }

  // Regular users must exist in the DB (keeps revoked/deleted accounts logged out).
  try {
    await dbConnect();
    const user = (await User.findOne({ _id: payload.id })
      .select('email firstName lastName role')
      .lean()
      .exec()) as { _id: unknown; email: string; firstName: string; lastName: string; role?: string } | null;
    if (!user) return null;
    return {
      id: String(user._id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user',
    };
  } catch {
    // DB unavailable: trust the cryptographically-signed token (still verified).
    return {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName || '',
      role: payload.role,
    };
  }
}

export function requireAuth(handler: AuthedHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    const session = await getServerSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    (req as NextApiRequest & { user: SessionUser }).user = session;
    return handler(req as NextApiRequest & { user: SessionUser }, res);
  };
}

export function requireAdmin(handler: AuthedHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    const session = await getServerSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (session.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    (req as NextApiRequest & { user: SessionUser }).user = session;
    return handler(req as NextApiRequest & { user: SessionUser }, res);
  };
}

export async function logout(req: NextApiRequest, res: NextApiResponse) {
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
}
