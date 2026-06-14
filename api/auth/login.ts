import type { VercelRequest, VercelResponse } from '@vercel/node'

// 共享内存数据库（与register共享）
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
    const { email, password } = req.body || {}

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: '请输入邮箱和密码'
      })
    }

    // 查找用户
    const user = USERS_DB[email]
    if (!user || user.password !== password) {
      return res.status(401).json({
        code: 401,
        message: '邮箱或密码错误'
      })
    }

    // 生成token
    const token = `token_${user.id}_${Date.now()}`

    // 返回用户信息
    return res.status(200).json({
      code: 0,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'admin',
          enterpriseId: `ent_${user.id}`
        },
        token,
        enterprise: {
          id: `ent_${user.id}`,
          name: user.companyName,
          industry: user.industry,
          size: user.size || '',
          slug: user.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substr(0, 20),
          planType: 'free',
          settings: {
            publicEnabled: false,
            welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
          },
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
