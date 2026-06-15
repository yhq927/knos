const { businessUnits, users } = require('../db');

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
  const units = Object.values(businessUnits).filter(bu => bu.enterpriseId === enterpriseId);

  if (req.method === 'GET') {
    return res.status(200).json({ code: 0, message: 'success', data: units });
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ code: 400, message: '请输入业务单元名称' });
    const id = 'bu_' + Date.now();
    businessUnits[id] = { id, enterpriseId, name, description: description || '', status: 'active', createdAt: new Date().toISOString() };
    return res.status(200).json({ code: 0, message: '创建成功', data: businessUnits[id] });
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' });
};
