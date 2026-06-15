import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getEnterpriseById, generateToken, users, enterprises } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ code: 401, message: '邮箱或密码错误' });
    }

    // Get enterprise
    const enterprise = getEnterpriseById(user.enterpriseId);
    if (!enterprise) {
      return res.status(404).json({ code: 404, message: '企业不存在' });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      enterpriseId: enterprise.id
    });

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
