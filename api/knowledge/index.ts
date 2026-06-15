import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getKnowledgeByEnterprise, knowledge } from '../lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
    const knowledgeList = getKnowledgeByEnterprise(decoded.enterpriseId);

    if (req.method === 'GET') {
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: { list: knowledgeList, total: knowledgeList.length }
      });
    }

    if (req.method === 'POST') {
      const { title, content, contentType, visibility } = req.body;
      if (!title || !content || !contentType) {
        return res.status(400).json({ code: 400, message: 'Missing required fields' });
      }

      const id = `k_${Date.now()}`;
      const newEntry = {
        id,
        enterpriseId: decoded.enterpriseId,
        title,
        content,
        contentType,
        visibility: visibility || 'private',
        status: 'draft',
        version: 1,
        createdBy: decoded.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      knowledge[id] = newEntry;
      return res.status(200).json({ code: 0, message: 'Created', data: newEntry });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
