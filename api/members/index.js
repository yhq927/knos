const { users } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        list: [
          { id: 'u1', name: '张三', email: 'zhangsan@test.com', role: 'admin', createdAt: new Date().toISOString() },
          { id: 'u2', name: '李四', email: 'lisi@test.com', role: 'editor', createdAt: new Date().toISOString() },
          { id: 'u3', name: '王五', email: 'wangwu@test.com', role: 'viewer', createdAt: new Date().toISOString() }
        ],
        total: 3
      }
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ code: 0, message: '邀请已发送', data: { ...req.body, status: 'pending' } });
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' });
};
