import { requireAdmin } from '@/lib/auth';

const ALLOWED_HOSTS = new Set<string>([
  'res.cloudinary.com',
  'api.cloudinary.com',
  'cloudinary.com',
]);

export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const hostname = parsed.hostname.toLowerCase();
    const isAllowed = ALLOWED_HOSTS.has(hostname) || hostname.endsWith('.cloudinary.com');
    if (!isAllowed) {
      return res.status(403).json({ error: 'URL hostname is not allowed' });
    }

    const response = await fetch(url, { method: 'HEAD' });

    if (response.ok) {
      return res.status(200).json({ success: true, status: response.status, message: 'URL is accessible' });
    }
    return res.status(400).json({ success: false, status: response.status, message: 'URL is not accessible' });
  } catch (error) {
    console.error('Test URL error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});
