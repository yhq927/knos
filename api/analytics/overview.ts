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
    data: {
      aiChatCount: 156,
      knowledgeCount: 42,
      activeUsers: 12,
      adoptionRate: 78,
      aiChatTrend: 25,
      knowledgeTrend: 12
    }
  })
}
