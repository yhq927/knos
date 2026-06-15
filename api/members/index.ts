import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ code: 401, message: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          list: [
            { id: 'u1', name: 'Zhang San', email: 'zhangsan@test.com', role: 'admin', createdAt: new Date().toISOString() },
            { id: 'u2', name: 'Li Si', email: 'lisi@test.com', role: 'editor', createdAt: new Date().toISOString() },
            { id: 'u3', name: 'Wang Wu', email: 'wangwu@test.com', role: 'viewer', createdAt: new Date().toISOString() }
          ],
          total: 3
        }
      });
    }

    if (req.method === 'POST') {
      return res.status(200).json({ code: 0, message: 'Invitation sent', data: { ...req.body, status: 'pending' } });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
