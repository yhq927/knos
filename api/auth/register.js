const { users, enterprises } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  const { email, password, companyName, industry, size } = req.body || {};
  if (!email || !password || !companyName || !industry) {
    return res.status(400).json({ code: 400, message: '请填写所有必填字段' });
  }
  if (password.length < 8) {
    return res.status(400).json({ code: 400, message: '密码至少8位' });
  }
  if (users[email]) {
    return res.status(400).json({ code: 400, message: '该邮箱已注册' });
  }

  const enterpriseId = 'ent_' + Date.now();
  enterprises[enterpriseId] = {
    id: enterpriseId,
    name: companyName,
    industry,
    size: size || '',
    slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20),
    planType: 'free',
    status: 'active',
    settings: { publicEnabled: false, welcomeMessage: '您好，我是您的智能助手' },
    createdAt: new Date().toISOString()
  };

  const userId = 'user_' + Date.now();
  users[email] = {
    id: userId,
    email,
    password,
    name: email.split('@')[0],
    role: 'admin',
    enterpriseId,
    createdAt: new Date().toISOString()
  };

  const token = 'token_' + userId + '_' + Date.now();
  const { password: _, ...userInfo } = users[email];

  return res.status(200).json({
    code: 0,
    message: '注册成功',
    data: { user: userInfo, token, enterprise: enterprises[enterpriseId] }
  });
};
