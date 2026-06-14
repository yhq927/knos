import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.url?.includes('/goals')) {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: [
        { id: 'g1', name: '公司基本信息', description: '采集公司基本信息', status: 'in_progress', progress: 3, total: 5 },
        { id: 'g2', name: '业务介绍', description: '采集业务相关信息', status: 'pending', progress: 0, total: 4 },
        { id: 'g3', name: '常见问题', description: '采集常见问题', status: 'completed', progress: 5, total: 5 }
      ]
    })
  }

  if (req.url?.includes('/current')) {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        id: 'q1',
        goalId: 'g1',
        content: '请介绍一下贵公司的主要业务是什么？',
        type: 'open'
      }
    })
  }

  if (req.url?.includes('/answer') || req.url?.includes('/skip')) {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        id: 'q2',
        goalId: 'g1',
        content: '贵公司的核心竞争优势是什么？',
        type: 'open'
      }
    })
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' })
}
