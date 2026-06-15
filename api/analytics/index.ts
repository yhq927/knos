import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getKnowledgeByEnterprise } from '../lib/db';

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
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ code: 401, message: 'Invalid token' });

  try {
    const knowledgeList = getKnowledgeByEnterprise(decoded.enterpriseId);

    if (req.url?.includes('/overview')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: { knowledgeCount: knowledgeList.length, memberCount: 5, aiChatCount: 156, adoptionRate: 78, knowledgeTrend: 12, aiChatTrend: 25 }
      });
    }

    if (req.url?.includes('/hot')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: [
          { question: 'How to register?', count: 45, lastAsked: new Date().toISOString() },
          { question: 'What file formats are supported?', count: 38, lastAsked: new Date().toISOString() },
          { question: 'How to invite team members?', count: 32, lastAsked: new Date().toISOString() }
        ]
      });
    }

    if (req.url?.includes('/uncovered')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: [
          { question: 'How to backup data?', count: 15, lastAsked: new Date().toISOString() },
          { question: 'Is multi-language supported?', count: 12, lastAsked: new Date().toISOString() }
        ]
      });
    }

    if (req.url?.includes('/ranking')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: [
          { userId: 'u1', name: 'Zhang San', chatCount: 56, knowledgeCount: 12 },
          { userId: 'u2', name: 'Li Si', chatCount: 42, knowledgeCount: 8 },
          { userId: 'u3', name: 'Wang Wu', chatCount: 35, knowledgeCount: 6 }
        ]
      });
    }

    return res.status(404).json({ code: 404, message: 'Not found' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
