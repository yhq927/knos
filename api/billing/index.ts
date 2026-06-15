import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getEnterpriseById, getKnowledgeByEnterprise } from '../lib/db';

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
    const enterprise = getEnterpriseById(decoded.enterpriseId);
    if (!enterprise) return res.status(404).json({ code: 404, message: 'Enterprise not found' });

    const knowledgeList = getKnowledgeByEnterprise(decoded.enterpriseId);

    if (req.method === 'GET' && req.url?.includes('/plan')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: { planType: enterprise.planType || 'free', name: enterprise.planType === 'pro' ? 'Pro' : 'Free', price: enterprise.planType === 'pro' ? 299 : 0 }
      });
    }

    if (req.method === 'GET' && req.url?.includes('/usage')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: { aiUsed: 23, aiLimit: 50, storageUsed: 128, storageLimit: 500, memberCount: 5, memberLimit: 10, knowledgeCount: knowledgeList.length, knowledgeLimit: 500 }
      });
    }

    if (req.method === 'POST' && req.url?.includes('/upgrade')) {
      const { planType } = req.body;
      enterprise.planType = planType;
      return res.status(200).json({ code: 0, message: 'Upgraded', data: { planType, paymentUrl: `https://example.com/pay?plan=${planType}` } });
    }

    return res.status(404).json({ code: 404, message: 'Not found' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
