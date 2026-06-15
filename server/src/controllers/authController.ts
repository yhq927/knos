import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models/database';

const JWT_SECRET = process.env.JWT_SECRET || 'knosai-secret-key';

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, companyName, industry, size } = req.body;

    // Validate required fields
    if (!email || !password || !companyName || !industry) {
      return res.status(400).json({
        code: 400,
        message: '请填写所有必填字段'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        code: 400,
        message: '请输入有效的邮箱地址'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        code: 400,
        message: '密码至少8位'
      });
    }

    // Check if email already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '该邮箱已注册'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create enterprise
    const enterprise = db.createEnterprise({
      name: companyName,
      industry,
      size: size || '',
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substr(0, 20),
      planType: 'free',
      apiKeys: {},
      settings: {
        publicEnabled: false,
        welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
      }
    });

    // Create user
    const user = db.createUser({
      email,
      password: hashedPassword,
      name: email.split('@')[0],
      role: 'admin',
      enterpriseId: enterprise.id
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        enterpriseId: enterprise.id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user info (without password)
    const { password: _, ...userInfo } = user;

    return res.status(200).json({
      code: 0,
      message: '注册成功',
      data: {
        user: userInfo,
        token,
        enterprise
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: '请输入邮箱和密码'
      });
    }

    // Find user
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '邮箱或密码错误'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '邮箱或密码错误'
      });
    }

    // Get enterprise
    const enterprise = db.getEnterpriseById(user.enterpriseId);
    if (!enterprise) {
      return res.status(404).json({
        code: 404,
        message: '企业不存在'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        enterpriseId: enterprise.id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = db.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    const enterprise = db.getEnterpriseById(user.enterpriseId);
    const { password: _, ...userInfo } = user;

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        user: userInfo,
        enterprise
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};
