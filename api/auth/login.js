const { users, enterprises } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ code: 400, message: '请输入邮箱和密码' });

  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
  }

  const enterprise = enterprises[user.enterpriseId];
  const token = 'token_' + user.id + '_' + Date.now();
  const { password: _, ...userInfo } = user;

  return res.status(200).json({
    code: 0,
    message: '登录成功',
    data: { user: userInfo, token, enterprise }
  });
};
