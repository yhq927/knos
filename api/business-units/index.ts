import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getBusinessUnitsByEnterprise, businessUnits } from '../lib/db';

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
    if (req.method === 'GET') {
      const units = getBusinessUnitsByEnterprise(decoded.enterpriseId);
      return res.status(200).json({ code: 0, message: 'success', data: units });
    }

    if (req.method === 'POST') {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ code: 400, message: 'Name is required' });
      const id = `bu_${Date.now()}`;
      businessUnits[id] = { id, enterpriseId: decoded.enterpriseId, name, description: description || '', status: 'active', createdAt: new Date().toISOString() };
      return res.status(200).json({ code: 0, message: 'Created', data: businessUnits[id] });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
