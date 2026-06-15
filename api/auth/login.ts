import type { VercelRequest, VercelResponse } from '@vercel/node';

// 简单的用户数据库（测试用）
const users: Record<string, {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  enterpriseId: string;
}> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: '测试用户',
    role: 'admin',
    enterpriseId: 'ent_test'
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
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ code: 400, message: '请输入邮箱和密码' });
    }

    // Find user
    const user = users[email];
    if (!user) {
      return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
    }

    // Simple password comparison (for testing)
    if (password !== user.password) {
      return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
    }

    // Get enterprise
    const enterprise = enterprises[user.enterpriseId];
    if (!enterprise) {
      return res.status(404).json({ code: 404, message: '企业不存在' });
    }

    // Generate simple token (for testing)
    const token = `token_${user.id}_${Date.now()}`;

    // Return user info (without password)
    const { password: _, ...userInfo } = user;

    return res.status(200).json({
      code: 0,
      message: '登录成功',
      data: {
        user: userInfo,
        token,
        enterprise
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
