import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        list: [
          {
            id: 'f1',
            originalName: '公司简介.docx',
            fileSize: 102400,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            status: 'completed',
            progress: 100,
            parsedCount: 5,
            createdAt: new Date().toISOString()
          },
          {
            id: 'f2',
            originalName: '产品手册.pdf',
            fileSize: 2048000,
            mimeType: 'application/pdf',
            status: 'completed',
            progress: 100,
            parsedCount: 12,
            createdAt: new Date().toISOString()
          }
        ],
        total: 2
      }
    })
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      code: 0,
      message: '上传成功',
      data: {
        id: `f_${Date.now()}`,
        status: 'processing',
        progress: 0,
        createdAt: new Date().toISOString()
      }
    })
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' })
}
