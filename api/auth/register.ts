import type { VercelRequest, VercelResponse } from '@vercel/node'

// 模拟用户数据库
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  companyName: string
  industry: string
  size?: string
  createdAt: string
}> = []

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' })
  }

  try {
    const { email, password, companyName, industry, size } = req.body

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
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '该邮箱已注册'
      })
    }

    // 创建用户
    const user = {
      id: `user_${Date.now()}`,
      email,
      password, // 实际应用中需要加密
      name: email.split('@')[0],
      companyName,
      industry,
      size,
      createdAt: new Date().toISOString()
    }

    users.push(user)

    // 生成模拟token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user

    return res.status(200).json({
      code: 0,
      message: '注册成功',
      data: {
        user: userInfo,
        token,
        enterprise: {
          id: `ent_${Date.now()}`,
          name: companyName,
          industry,
          size,
          slug: companyName.toLowerCase().replace(/\s+/g, '-').substr(0, 20),
          planType: 'free',
          settings: {},
          createdAt: new Date().toISOString()
        }
      }
    })
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
