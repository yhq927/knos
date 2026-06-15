const { knowledge, users } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
  const user = Object.values(users).find(u => u.id === 'user_' + userId);
  if (!user) {
    return res.status(401).json({ code: 401, message: '用户不存在' });
  }

  const enterpriseId = user.enterpriseId;
  const knowledgeList = Object.values(knowledge).filter(k => k.enterpriseId === enterpriseId);

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
      return res.status(400).json({ code: 400, message: '请填写所有必填字段' });
    }
    const id = 'k_' + Date.now();
    const newEntry = {
      id,
      enterpriseId,
      title,
      content,
      contentType,
      visibility: visibility || 'private',
      status: 'draft',
      version: 1,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    knowledge[id] = newEntry;
    return res.status(200).json({ code: 0, message: '创建成功', data: newEntry });
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' });
};
