import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  return res.status(200).json({
    code: 0,
    message: 'success',
    data: [
      { question: '如何进行数据备份？', count: 15, lastAsked: new Date().toISOString() },
      { question: '支持多语言吗？', count: 12, lastAsked: new Date().toISOString() },
      { question: '如何自定义AI模型？', count: 10, lastAsked: new Date().toISOString() }
    ]
  })
}
