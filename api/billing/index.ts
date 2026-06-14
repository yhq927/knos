import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.url?.includes('/plan')) {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        planType: 'free',
        name: '免费版',
        price: 0,
        features: ['1个企业', '10个成员', '500条知识', '50次AI试用']
      }
    })
  }

  if (req.url?.includes('/usage')) {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        aiUsed: 23,
        aiLimit: 50,
        storageUsed: 128,
        storageLimit: 500,
        memberCount: 5,
        memberLimit: 10
      }
    })
  }

  return res.status(200).json({
    code: 0,
    message: 'success',
    data: {}
  })
}
