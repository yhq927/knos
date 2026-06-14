import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
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
            id: 'n1',
            type: 'document_parsed',
            title: '文档解析完成',
            content: '文档 公司简介.docx 解析完成，共提取 5 条知识',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'n2',
            type: 'member_joined',
            title: '新成员加入',
            content: '李四 已加入企业',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        total: 2,
        unreadCount: 1
      }
    })
  }

  if (req.url?.includes('/read-all')) {
    return res.status(200).json({
      code: 0,
      message: 'success'
    })
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' })
}
