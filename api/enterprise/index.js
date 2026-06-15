const { enterprises, knowledge } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  const parts = token.split('_');
  if (parts.length < 3) {
    return res.status(401).json({ code: 401, message: 'Token无效' });
  }

  const userId = parts[1];
  const user = Object.values(require('../db').users).find(u => u.id === 'user_' + userId);
  if (!user) {
    return res.status(401).json({ code: 401, message: '用户不存在' });
  }

  const enterpriseId = user.enterpriseId;

  if (req.method === 'GET') {
    if (req.url && req.url.includes('/stats')) {
      const knowledgeList = Object.values(knowledge).filter(k => k.enterpriseId === enterpriseId);
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

    const enterprise = enterprises[enterpriseId];
    if (!enterprise) return res.status(404).json({ code: 404, message: '企业不存在' });
    return res.status(200).json({ code: 0, message: 'success', data: enterprise });
  }

  if (req.method === 'PUT') {
    const enterprise = enterprises[enterpriseId];
    if (!enterprise) return res.status(404).json({ code: 404, message: '企业不存在' });
    Object.assign(enterprise, req.body, { updatedAt: new Date().toISOString() });
    return res.status(200).json({ code: 0, message: '更新成功', data: enterprise });
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' });
};
