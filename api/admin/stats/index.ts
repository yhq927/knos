import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enterprises, users, knowledge } from '../../lib/db';

// 验证管理员token
function verifyAdminToken(token: string): boolean {
  return token.startsWith('admin_token_');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  }

  // 验证管理员token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ code: 401, message: '无效的管理员Token' });
  }

  try {
    const totalEnterprises = Object.keys(enterprises).length;
    const totalUsers = Object.keys(users).length;
    const totalKnowledge = Object.keys(knowledge).length;

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        totalEnterprises,
        totalUsers,
        totalKnowledge,
        dailyActive: Math.floor(totalUsers * 0.3), // 模拟30%日活
        weeklyActive: Math.floor(totalUsers * 0.6), // 模拟60%周活
        monthlyActive: Math.floor(totalUsers * 0.8), // 模拟80%月活
        proEnterprises: Object.values(enterprises).filter(e => e.planType === 'pro').length,
        enterpriseEnterprises: Object.values(enterprises).filter(e => e.planType === 'enterprise').length
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ code: 500, message: '服务器错�? });
  }
}
