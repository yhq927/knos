import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enterprises } from '../../lib/db';

function verifyAdminToken(token: string): boolean {
  return token.startsWith('admin_token_');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'No token provided' });
  }

  const token = authHeader.substring(7);
  if (!verifyAdminToken(token)) return res.status(401).json({ code: 401, message: 'Invalid admin token' });

  try {
    if (req.method === 'GET') {
      const { limit } = req.query;
      let list: any[] = Object.values(enterprises).map((e: any) => ({ ...e, status: e.status || 'active' }));
      list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (limit && typeof limit === 'string') list = list.slice(0, parseInt(limit));
      return res.status(200).json({ code: 0, message: 'success', data: { list, total: list.length } });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ code: 400, message: 'Missing enterprise ID' });
      const enterprise = enterprises[id];
      if (!enterprise) return res.status(404).json({ code: 404, message: 'Enterprise not found' });
      Object.assign(enterprise, req.body, { updatedAt: new Date().toISOString() });
      return res.status(200).json({ code: 0, message: 'Updated', data: enterprise });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
