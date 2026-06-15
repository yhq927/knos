import type { VercelRequest, VercelResponse } from '@vercel/node';

// 共享数据库（简化版）
const users: Record<string, any> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: '测试用户',
    role: 'admin',
    enterpriseId: 'ent_test',
    createdAt: new Date().toISOString()
  }
};

const enterprises: Record<string, any> = {
  'ent_test': {
    id: 'ent_test',
    name: '测试公司',
    industry: 'technology',
    size: '11-50',
    slug: 'test-company',
    planType: 'free',
    settings: {
      publicEnabled: false,
      welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
    },
    createdAt: new Date().toISOString()
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  }

  try {
    const { email, password, companyName, industry, size } = req.body || {};

    // Validate
    if (!email || !password || !companyName || !industry) {
      return res.status(400).json({ code: 400, message: '请填写所有必填字段' });
    }

    if (password.length < 8) {
      return res.status(400).json({ code: 400, message: '密码至少8位' });
    }

    // Check if email exists
    if (users[email]) {
      return res.status(400).json({ code: 400, message: '该邮箱已注册' });
    }

    // Create enterprise
    const enterpriseId = `ent_${Date.now()}`;
    enterprises[enterpriseId] = {
      id: enterpriseId,
      name: companyName,
      industry,
      size: size || '',
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substr(0, 20),
      planType: 'free',
      settings: {
        publicEnabled: false,
        welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
      },
      createdAt: new Date().toISOString()
    };

    // Create user
    const userId = `user_${Date.now()}`;
    users[email] = {
      id: userId,
      email,
      password: password, // Simple storage for testing
      name: email.split('@')[0],
      role: 'admin',
      enterpriseId,
      createdAt: new Date().toISOString()
    };

    // Generate token
    const token = `token_${userId}_${Date.now()}`;

    const { password: _, ...userInfo } = users[email];

    return res.status(200).json({
      code: 0,
      message: '注册成功',
      data: {
        user: userInfo,
        token,
        enterprise: enterprises[enterpriseId]
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
