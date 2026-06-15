const adminUsers = {
  'admin': { id: 'admin_001', username: 'admin', password: 'admin123', role: 'super_admin' }
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ code: 400, message: '请输入账号和密码' });

  const admin = adminUsers[username];
  if (!admin || admin.password !== password) {
    return res.status(401).json({ code: 401, message: '账号或密码错误' });
  }

  const token = 'admin_token_' + admin.id + '_' + Date.now();
  return res.status(200).json({
    code: 0, message: '登录成功',
    data: { user: { id: admin.id, username: admin.username, role: admin.role }, token }
  });
};
