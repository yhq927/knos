import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getKnowledgeByEnterprise } from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // Verify token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ code: 401, message: 'Token无效' });
  }

  try {
    const knowledgeList = getKnowledgeByEnterprise(decoded.enterpriseId);

    // Overview
    if (req.url?.includes('/overview')) {
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

    // Hot questions
    if (req.url?.includes('/hot')) {
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: [
          { question: '如何注册账号？', count: 45, lastAsked: new Date().toISOString() },
          { question: '支持哪些文件格式？', count: 38, lastAsked: new Date().toISOString() },
          { question: '如何邀请团队成员？', count: 32, lastAsked: new Date().toISOString() },
          { question: '免费版有什么限制？', count: 28, lastAsked: new Date().toISOString() },
          { question: '如何导出知识库？', count: 25, lastAsked: new Date().toISOString() }
        ]
      });
    }

    // Uncovered questions
    if (req.url?.includes('/uncovered')) {
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: [
          { question: '如何进行数据备份？', count: 15, lastAsked: new Date().toISOString() },
          { question: '支持多语言吗？', count: 12, lastAsked: new Date().toISOString() },
          { question: '如何自定义AI模型？', count: 10, lastAsked: new Date().toISOString() }
        ]
      });
    }

    // User ranking
    if (req.url?.includes('/ranking')) {
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: [
          { userId: 'u1', name: '张三', chatCount: 56, knowledgeCount: 12 },
          { userId: 'u2', name: '李四', chatCount: 42, knowledgeCount: 8 },
          { userId: 'u3', name: '王五', chatCount: 35, knowledgeCount: 6 },
          { userId: 'u4', name: '赵六', chatCount: 28, knowledgeCount: 5 },
          { userId: 'u5', name: '钱七', chatCount: 22, knowledgeCount: 4 }
        ]
      });
    }

    return res.status(404).json({ code: 404, message: 'Not found' });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
