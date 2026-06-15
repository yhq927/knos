import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple user database
const users: Record<string, any> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: 'Test User',
    role: 'admin',
    enterpriseId: 'ent_test'
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
    status: 'active',
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
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ code: 400, message: 'Please enter email and password' });

    const user = users[email];
    if (!user || user.password !== password) {
      return res.status(401).json({ code: 401, message: 'Invalid email or password' });
    }

    const enterprise = enterprises[user.enterpriseId];
    const token = `token_${user.id}_${Date.now()}`;
    const { password: _, ...userInfo } = user;

    return res.status(200).json({
      code: 0,
      message: 'Login successful',
      data: { user: userInfo, token, enterprise }
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
