import type { VercelRequest, VercelResponse } from '@vercel/node';

const adminUsers: Record<string, any> = {
  'admin': { id: 'admin_001', username: 'admin', password: 'admin123', role: 'super_admin' }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' });

  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ code: 400, message: 'Please enter username and password' });

    const admin = adminUsers[username];
    if (!admin || admin.password !== password) return res.status(401).json({ code: 401, message: 'Invalid credentials' });

    const token = `admin_token_${admin.id}_${Date.now()}`;
    return res.status(200).json({
      code: 0, message: 'Login successful',
      data: { user: { id: admin.id, username: admin.username, role: admin.role }, token }
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
