import type { VercelRequest, VercelResponse } from '@vercel/node'

// 模拟用户数据库（与register共享）
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  companyName: string
  industry: string
  size?: string
  createdAt: string
}> = [
  // 预置测试用户
  {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: '测试用户',
    companyName: '测试公司',
    industry: 'technology',
    createdAt: new Date().toISOString()
  }
]

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
    const { email, password } = req.body

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: '请输入邮箱和密码'
      })
    }

    // 查找用户
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '邮箱或密码错误'
      })
    }

    // 生成模拟token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user

    return res.status(200).json({
      code: 0,
      message: '登录成功',
      data: {
        user: userInfo,
        token,
        enterprise: {
          id: `ent_${user.id}`,
          name: user.companyName,
          industry: user.industry,
          slug: user.companyName.toLowerCase().replace(/\s+/g, '-').substr(0, 20),
          planType: 'free',
          settings: {},
          createdAt: user.createdAt
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
