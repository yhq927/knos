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
      { userId: 'u1', name: '张三', chatCount: 56, knowledgeCount: 12 },
      { userId: 'u2', name: '李四', chatCount: 42, knowledgeCount: 8 },
      { userId: 'u3', name: '王五', chatCount: 35, knowledgeCount: 6 },
      { userId: 'u4', name: '赵六', chatCount: 28, knowledgeCount: 5 },
      { userId: 'u5', name: '钱七', chatCount: 22, knowledgeCount: 4 }
    ]
  })
}
