import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enterprises, getEnterpriseById, getKnowledgeByEnterprise } from '../../_lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 获取slug
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ code: 400, message: '缺少企业标识' });
    }

    // 查找企业
    const enterprise = Object.values(enterprises).find(e => e.slug === slug);
    if (!enterprise) {
      return res.status(404).json({ code: 404, message: '企业不存在' });
    }

    // 检查是否开启对外服务
    if (!enterprise.settings?.publicEnabled) {
      return res.status(403).json({ code: 403, message: '该企业未开启对外服务' });
    }

    // GET /api/public/:slug - 获取企业公开信息
    if (req.method === 'GET' && !req.url?.includes('/chat') && !req.url?.includes('/knowledge')) {
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          id: enterprise.id,
          name: enterprise.name,
          industry: enterprise.industry,
          welcomeMessage: enterprise.settings?.welcomeMessage || '您好，我是您的智能助手，请问您想了解什么？',
          brandColor: enterprise.settings?.brandColor || '#667eea'
        }
      });
    }

    // GET /api/public/:slug/knowledge - 获取公开知识列表
    if (req.method === 'GET' && req.url?.includes('/knowledge')) {
      const knowledgeList = getKnowledgeByEnterprise(enterprise.id)
        .filter(k => k.visibility === 'public' && k.status === 'published');

      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          list: knowledgeList,
          total: knowledgeList.length
        }
      });
    }

    // POST /api/public/:slug/chat - 对外AI问答（模拟）
    if (req.method === 'POST' && req.url?.includes('/chat')) {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ code: 400, message: '请输入问题' });
      }

      // 获取公开知识
      const knowledgeList = getKnowledgeByEnterprise(enterprise.id)
        .filter(k => k.visibility === 'public' && k.status === 'published');

      // 模拟AI回答
      const answer = `感谢您的提问！基于我们的知识库，我来回答您的问题：\n\n${message}\n\n这是一个模拟回答，实际应用中会基于企业知识库生成更精准的回答。`;

      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          answer,
          sources: knowledgeList.slice(0, 2).map(k => ({
            type: 'enterprise',
            name: k.title
          })),
          confidence: 'high'
        }
      });
    }

    return res.status(404).json({ code: 404, message: 'Not found' });
  } catch (error) {
    console.error('Public API error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
