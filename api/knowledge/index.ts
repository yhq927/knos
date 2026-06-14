import type { VercelRequest, VercelResponse } from '@vercel/node'

// 模拟知识库数据
const knowledgeList = [
  {
    id: 'k1',
    title: '公司简介',
    content: '我们是一家专注于AI技术的创新公司...',
    contentType: 'guide',
    visibility: 'public',
    status: 'published',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'k2',
    title: '产品使用指南',
    content: '本指南将帮助您快速上手我们的产品...',
    contentType: 'sop',
    visibility: 'team',
    status: 'published',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'k3',
    title: '常见问题解答',
    content: 'Q: 如何注册账号？\nA: 点击首页的注册按钮...',
    contentType: 'faq',
    visibility: 'public',
    status: 'published',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

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
      data: {
        list: knowledgeList,
        total: knowledgeList.length
      }
    })
  }

  if (req.method === 'POST') {
    const newEntry = {
      id: `k${Date.now()}`,
      ...req.body,
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    knowledgeList.push(newEntry)
    return res.status(200).json({
      code: 0,
      message: '创建成功',
      data: newEntry
    })
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' })
}
