import type { VercelRequest, VercelResponse } from '@vercel/node';

const users: Record<string, any> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: 'Test User',
    role: 'admin',
    enterpriseId: 'ent_test',
    createdAt: new Date().toISOString()
  }
};

const enterprises: Record<string, any> = {
  'ent_test': {
    id: 'ent_test',
    name: 'Test Company',
    industry: 'technology',
    size: '11-50',
    slug: 'test-company',
    planType: 'free',
    settings: { publicEnabled: false },
    createdAt: new Date().toISOString()
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  try {
    const { email, password, companyName, industry, size } = req.body || {};
    if (!email || !password || !companyName || !industry) {
      return res.status(400).json({ code: 400, message: 'Please fill all required fields' });
    }
    if (password.length < 8) {
      return res.status(400).json({ code: 400, message: 'Password must be at least 8 characters' });
    }
    if (users[email]) {
      return res.status(400).json({ code: 400, message: 'Email already registered' });
    }

    const enterpriseId = `ent_${Date.now()}`;
    enterprises[enterpriseId] = {
      id: enterpriseId,
      name: companyName,
      industry,
      size: size || '',
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20),
      planType: 'free',
      settings: { publicEnabled: false },
      createdAt: new Date().toISOString()
    };

    const userId = `user_${Date.now()}`;
    users[email] = {
      id: userId,
      email,
      password,
      name: email.split('@')[0],
      role: 'admin',
      enterpriseId,
      createdAt: new Date().toISOString()
    };

    const token = `token_${userId}_${Date.now()}`;
    const { password: _, ...userInfo } = users[email];

    return res.status(200).json({
      code: 0,
      message: 'Registration successful',
      data: { user: userInfo, token, enterprise: enterprises[enterpriseId] }
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
