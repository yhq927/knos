const { enterprises } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  if (req.method === 'GET') {
    const list = Object.values(enterprises).map(e => ({ ...e, status: e.status || 'active' }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.status(200).json({ code: 0, message: 'success', data: { list, total: list.length } });
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ code: 400, message: '缺少企业ID' });
    const enterprise = enterprises[id];
    if (!enterprise) return res.status(404).json({ code: 404, message: '企业不存在' });
    Object.assign(enterprise, req.body, { updatedAt: new Date().toISOString() });
    return res.status(200).json({ code: 0, message: '更新成功', data: enterprise });
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' });
};
