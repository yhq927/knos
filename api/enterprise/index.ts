import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getEnterpriseById, getKnowledgeByEnterprise } from '../lib/db';

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
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ code: 401, message: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      if (req.url?.includes('/stats')) {
        const knowledgeList = getKnowledgeByEnterprise(decoded.enterpriseId);
        return res.status(200).json({
          code: 0,
          message: 'success',
          data: {
            knowledgeCount: knowledgeList.length,
            memberCount: 5,
            aiChatCount: 156,
            adoptionRate: 78,
            knowledgeTrend: 12,
            aiChatTrend: 25
          }
        });
      }

      const enterprise = getEnterpriseById(decoded.enterpriseId);
      if (!enterprise) return res.status(404).json({ code: 404, message: 'Enterprise not found' });
      return res.status(200).json({ code: 0, message: 'success', data: enterprise });
    }

    if (req.method === 'PUT') {
      const enterprise = getEnterpriseById(decoded.enterpriseId);
      if (!enterprise) return res.status(404).json({ code: 404, message: 'Enterprise not found' });
      Object.assign(enterprise, req.body, { updatedAt: new Date().toISOString() });
      return res.status(200).json({ code: 0, message: 'Updated', data: enterprise });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
