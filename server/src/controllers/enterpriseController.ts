import { Request, Response } from 'express';
import { db } from '../models/database';

// Get enterprise info
export const getEnterprise = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    const enterprise = db.getEnterpriseById(enterpriseId);

    if (!enterprise) {
      return res.status(404).json({
        code: 404,
        message: '企业不存在'
      });
    }

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: enterprise
    });
  } catch (error) {
    console.error('Get enterprise error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Update enterprise
export const updateEnterprise = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const enterprise = db.updateEnterprise(enterpriseId, updateData);

    if (!enterprise) {
      return res.status(404).json({
        code: 404,
        message: '企业不存在'
      });
    }

    return res.status(200).json({
      code: 0,
      message: '更新成功',
      data: enterprise
    });
  } catch (error) {
    console.error('Update enterprise error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Get enterprise stats
export const getStats = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    const stats = db.getStats(enterpriseId);

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};
