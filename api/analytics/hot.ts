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
      { question: '如何注册账号？', count: 45, lastAsked: new Date().toISOString() },
      { question: '支持哪些文件格式？', count: 38, lastAsked: new Date().toISOString() },
      { question: '如何邀请团队成员？', count: 32, lastAsked: new Date().toISOString() },
      { question: '免费版有什么限制？', count: 28, lastAsked: new Date().toISOString() },
      { question: '如何导出知识库？', count: 25, lastAsked: new Date().toISOString() }
    ]
  })
}
