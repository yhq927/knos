import type { VercelRequest, VercelResponse } from '@vercel/node'

// 共享内存数据库（注意：这是临时方案，生产环境应使用数据库）
const USERS_DB: Record<string, {
  id: string
  email: string
  password: string
  name: string
  companyName: string
  industry: string
  size?: string
  createdAt: string
}> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: '测试用户',
    companyName: '测试公司',
    industry: 'technology',
    createdAt: new Date().toISOString()
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' })
  }

  try {
    const { email, password, companyName, industry, size } = req.body || {}

    // 验证必填字段
    if (!email || !password || !companyName || !industry) {
      return res.status(400).json({
        code: 400,
        message: '请填写所有必填字段'
      })
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        code: 400,
        message: '请输入有效的邮箱地址'
      })
    }

    // 验证密码长度
    if (password.length < 8) {
      return res.status(400).json({
        code: 400,
        message: '密码至少8位'
      })
    }

    // 检查邮箱是否已注册
    if (USERS_DB[email]) {
      return res.status(400).json({
        code: 400,
        message: '该邮箱已注册'
      })
    }

    // 创建用户
    const userId = `user_${Date.now()}`
    const user = {
      id: userId,
      email,
      password,
      name: email.split('@')[0],
      companyName,
      industry,
      size,
      createdAt: new Date().toISOString()
    }

    USERS_DB[email] = user

    // 生成token
    const token = `token_${userId}_${Date.now()}`

    // 返回用户信息
    return res.status(200).json({
      code: 0,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'admin',
          enterpriseId: `ent_${userId}`
        },
        token,
        enterprise: {
          id: `ent_${userId}`,
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
        }
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
