interface RateLimitEntry {
  count: number;
  first: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function getClientIp(req: { headers: Record<string, string | string[] | undefined> }): string {
  const header = req.headers['x-forwarded-for'];
  if (typeof header === 'string') {
    return header.split(',')[0].trim();
  }
  return (req.headers['x-forwarded-for'] as string[] | undefined)?.[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
}

export function rateLimitCheck(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.first > options.windowMs) {
    store.set(key, { count: 1, first: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= options.max;
}

export function rateLimitIp(req: { headers: Record<string, string | string[] | undefined> }, identifier: string, options: RateLimitOptions): boolean {
  return rateLimitCheck(`${identifier}:${getClientIp(req)}`, options);
}
