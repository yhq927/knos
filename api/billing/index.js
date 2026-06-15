const { users, enterprises, knowledge } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  const enterprise = enterprises[user.enterpriseId];
  if (!enterprise) {
    return res.status(404).json({ code: 404, message: '企业不存在' });
  }

  const knowledgeList = Object.values(knowledge).filter(k => k.enterpriseId === user.enterpriseId);

  if (req.method === 'GET' && req.url.includes('/plan')) {
    return res.status(200).json({
      code: 0, message: 'success',
      data: {
        planType: enterprise.planType || 'free',
        name: enterprise.planType === 'pro' ? '专业版' : '免费版',
        price: enterprise.planType === 'pro' ? 299 : 0,
        features: enterprise.planType === 'pro' 
          ? ['不限成员', '不限知识', '1000次AI问答/月', '对外服务功能']
          : ['1个企业', '10个成员', '500条知识', '50次AI试用']
      }
    });
  }

  if (req.method === 'GET' && req.url.includes('/usage')) {
    return res.status(200).json({
      code: 0, message: 'success',
      data: {
        aiUsed: 23, aiLimit: 50,
        storageUsed: 128, storageLimit: 500,
        memberCount: 5, memberLimit: 10,
        knowledgeCount: knowledgeList.length, knowledgeLimit: 500
      }
    });
  }

  if (req.method === 'POST' && req.url.includes('/upgrade')) {
    const { planType } = req.body;
    enterprise.planType = planType;
    return res.status(200).json({
      code: 0, message: '升级成功',
      data: { planType, paymentUrl: 'https://example.com/pay?plan=' + planType }
    });
  }

  return res.status(404).json({ code: 404, message: 'Not found' });
};
