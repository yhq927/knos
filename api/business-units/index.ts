import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getBusinessUnitsByEnterprise, businessUnits } from '../../_lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ code: 401, message: 'Token无效' });
  }

  try {
    // GET - 获取业务单元列表
    if (req.method === 'GET') {
      const units = getBusinessUnitsByEnterprise(decoded.enterpriseId);
      return res.status(200).json({
        code: 0,
        message: 'success',
        data: units
      });
    }

    // POST - 创建业务单元
    if (req.method === 'POST') {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ code: 400, message: '请输入业务单元名称' });
      }

      const id = `bu_${Date.now()}`;
      const newUnit = {
        id,
        enterpriseId: decoded.enterpriseId,
        name,
        description: description || '',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      businessUnits[id] = newUnit;

      return res.status(200).json({
        code: 0,
        message: '创建成功',
        data: newUnit
      });
    }

    // PUT - 更新业务单元
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ code: 400, message: '缺少业务单元ID' });
      }

      const unit = businessUnits[id];
      if (!unit || unit.enterpriseId !== decoded.enterpriseId) {
        return res.status(404).json({ code: 404, message: '业务单元不存在' });
      }

      const { name, description, status } = req.body;
      if (name) unit.name = name;
      if (description !== undefined) unit.description = description;
      if (status) unit.status = status;

      return res.status(200).json({
        code: 0,
        message: '更新成功',
        data: unit
      });
    }

    // DELETE - 删除业务单元
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ code: 400, message: '缺少业务单元ID' });
      }

      const unit = businessUnits[id];
      if (!unit || unit.enterpriseId !== decoded.enterpriseId) {
        return res.status(404).json({ code: 404, message: '业务单元不存在' });
      }

      delete businessUnits[id];

      return res.status(200).json({
        code: 0,
        message: '删除成功'
      });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    console.error('Business units error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
