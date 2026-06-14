import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: [
        { id: 'bu1', name: '技术部', description: '负责产品研发', status: 'active' },
        { id: 'bu2', name: '市场部', description: '负责市场推广', status: 'active' },
        { id: 'bu3', name: '客服部', description: '负责客户服务', status: 'active' }
      ]
    })
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' })
}
