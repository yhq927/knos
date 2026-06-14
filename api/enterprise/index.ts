import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 返回模拟企业信息
  return res.status(200).json({
    code: 0,
    message: 'success',
    data: {
      id: 'ent_1',
      name: '测试公司',
      industry: 'technology',
      size: '11-50',
      slug: 'test-company',
      planType: 'free',
      description: '这是一家测试公司',
      contactPhone: '13800138000',
      contactEmail: 'contact@test.com',
      settings: {
        publicEnabled: false,
        welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
      },
      createdAt: new Date().toISOString()
    }
  })
}
