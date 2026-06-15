import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enterprises, users, knowledge } from '../../lib/db';

function verifyAdminToken(token: string): boolean {
  return token.startsWith('admin_token_');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'No token provided' });
  }

  const token = authHeader.substring(7);
  if (!verifyAdminToken(token)) return res.status(401).json({ code: 401, message: 'Invalid admin token' });

  try {
    return res.status(200).json({
      code: 0, message: 'success',
      data: {
        totalEnterprises: Object.keys(enterprises).length,
        totalUsers: Object.keys(users).length,
        totalKnowledge: Object.keys(knowledge).length,
        dailyActive: 3,
        weeklyActive: 5,
        monthlyActive: 8
      }
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
