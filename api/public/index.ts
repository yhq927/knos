import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enterprises, getKnowledgeByEnterprise } from '../lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ code: 400, message: 'Missing slug' });
    }

    const enterprise: any = Object.values(enterprises).find((e: any) => e.slug === slug);
    if (!enterprise) return res.status(404).json({ code: 404, message: 'Enterprise not found' });
    if (!enterprise.settings?.publicEnabled) return res.status(403).json({ code: 403, message: 'Public access not enabled' });

    if (req.method === 'GET' && !req.url?.includes('/chat') && !req.url?.includes('/knowledge')) {
      return res.status(200).json({
        code: 0, message: 'success',
        data: { id: enterprise.id, name: enterprise.name, industry: enterprise.industry, welcomeMessage: enterprise.settings?.welcomeMessage || 'Hello' }
      });
    }

    if (req.method === 'GET' && req.url?.includes('/knowledge')) {
      const list = getKnowledgeByEnterprise(enterprise.id).filter((k: any) => k.visibility === 'public' && k.status === 'published');
      return res.status(200).json({ code: 0, message: 'success', data: { list, total: list.length } });
    }

    if (req.method === 'POST' && req.url?.includes('/chat')) {
      const { message } = req.body;
      if (!message) return res.status(400).json({ code: 400, message: 'Message is required' });
      return res.status(200).json({
        code: 0, message: 'success',
        data: { answer: `Thank you for your question: ${message}`, sources: [], confidence: 'high' }
      });
    }

    return res.status(404).json({ code: 404, message: 'Not found' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
