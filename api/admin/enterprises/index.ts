import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enterprises, getEnterpriseById } from '../../../_lib/db';

// 验证管理员token
function verifyAdminToken(token: string): boolean {
  return token.startsWith('admin_token_');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 验证管理员token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ code: 401, message: '无效的管理员Token' });
  }

  try {
    // GET - 获取企业列表
    if (req.method === 'GET') {
      const { limit } = req.query;
      let enterpriseList = Object.values(enterprises);
      
      // 添加status字段（如果没有）
      enterpriseList = enterpriseList.map(e => ({
        ...e,
        status: e.status || 'active'
      }));

      // 按创建时间倒序
      enterpriseList.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // 限制数量
      if (limit && typeof limit === 'string') {
        enterpriseList = enterpriseList.slice(0, parseInt(limit));
      }

      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          list: enterpriseList,
          total: enterpriseList.length
        }
      });
    }

    // PUT - 更新企业
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ code: 400, message: '缺少企业ID' });
      }

      const enterprise = enterprises[id];
      if (!enterprise) {
        return res.status(404).json({ code: 404, message: '企业不存在' });
      }

      const updateData = req.body;
      Object.assign(enterprise, updateData, { updatedAt: new Date().toISOString() });

      return res.status(200).json({
        code: 0,
        message: '更新成功',
        data: enterprise
      });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    console.error('Admin enterprises error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
