const { users, knowledge } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  if (req.url.includes('/overview')) {
    return res.status(200).json({
      code: 0, message: 'success',
      data: { knowledgeCount: 42, memberCount: 5, aiChatCount: 156, adoptionRate: 78, knowledgeTrend: 12, aiChatTrend: 25 }
    });
  }

  if (req.url.includes('/hot')) {
    return res.status(200).json({
      code: 0, message: 'success',
      data: [
        { question: '如何注册账号？', count: 45, lastAsked: new Date().toISOString() },
        { question: '支持哪些文件格式？', count: 38, lastAsked: new Date().toISOString() },
        { question: '如何邀请团队成员？', count: 32, lastAsked: new Date().toISOString() }
      ]
    });
  }

  if (req.url.includes('/uncovered')) {
    return res.status(200).json({
      code: 0, message: 'success',
      data: [
        { question: '如何进行数据备份？', count: 15, lastAsked: new Date().toISOString() },
        { question: '支持多语言吗？', count: 12, lastAsked: new Date().toISOString() }
      ]
    });
  }

  if (req.url.includes('/ranking')) {
    return res.status(200).json({
      code: 0, message: 'success',
      data: [
        { userId: 'u1', name: '张三', chatCount: 56, knowledgeCount: 12 },
        { userId: 'u2', name: '李四', chatCount: 42, knowledgeCount: 8 },
        { userId: 'u3', name: '王五', chatCount: 35, knowledgeCount: 6 }
      ]
    });
  }

  return res.status(404).json({ code: 404, message: 'Not found' });
};
