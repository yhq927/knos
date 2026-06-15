import { Request, Response } from 'express';
import { db } from '../models/database';

// Get knowledge list
export const getKnowledgeList = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    const { page, pageSize, keyword, contentType, visibility } = req.query;

    const result = db.getKnowledgeByEnterprise(enterpriseId, {
      page: page ? parseInt(page as string) : 1,
      pageSize: pageSize ? parseInt(pageSize as string) : 20,
      keyword: keyword as string,
      contentType: contentType as string,
      visibility: visibility as string
    });

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get knowledge list error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Get knowledge by ID
export const getKnowledgeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entry = db.getKnowledgeById(id);

    if (!entry) {
      return res.status(404).json({
        code: 404,
        message: '知识条目不存在'
      });
    }

    // Check if belongs to enterprise
    const enterpriseId = (req as any).enterpriseId;
    if (entry.enterpriseId !== enterpriseId) {
      return res.status(403).json({
        code: 403,
        message: '无权限访问'
      });
    }

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: entry
    });
  } catch (error) {
    console.error('Get knowledge by ID error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Create knowledge
export const createKnowledge = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    const userId = (req as any).userId;
    const { title, content, contentType, visibility, businessUnitId } = req.body;

    // Validate required fields
    if (!title || !content || !contentType) {
      return res.status(400).json({
        code: 400,
        message: '请填写所有必填字段'
      });
    }

    const entry = db.createKnowledge({
      enterpriseId,
      businessUnitId,
      title,
      content,
      contentType,
      visibility: visibility || 'private',
      status: 'draft',
      version: 1,
      createdBy: userId
    });

    return res.status(200).json({
      code: 0,
      message: '创建成功',
      data: entry
    });
  } catch (error) {
    console.error('Create knowledge error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Update knowledge
export const updateKnowledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enterpriseId = (req as any).enterpriseId;
    const updateData = req.body;

    // Check if exists and belongs to enterprise
    const existing = db.getKnowledgeById(id);
    if (!existing) {
      return res.status(404).json({
        code: 404,
        message: '知识条目不存在'
      });
    }

    if (existing.enterpriseId !== enterpriseId) {
      return res.status(403).json({
        code: 403,
        message: '无权限修改'
      });
    }

    // Remove sensitive fields
    delete updateData.id;
    delete updateData.enterpriseId;
    delete updateData.createdAt;
    delete updateData.createdBy;

    const entry = db.updateKnowledge(id, {
      ...updateData,
      version: existing.version + 1
    });

    return res.status(200).json({
      code: 0,
      message: '更新成功',
      data: entry
    });
  } catch (error) {
    console.error('Update knowledge error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Delete knowledge
export const deleteKnowledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enterpriseId = (req as any).enterpriseId;

    // Check if exists and belongs to enterprise
    const existing = db.getKnowledgeById(id);
    if (!existing) {
      return res.status(404).json({
        code: 404,
        message: '知识条目不存在'
      });
    }

    if (existing.enterpriseId !== enterpriseId) {
      return res.status(403).json({
        code: 403,
        message: '无权限删除'
      });
    }

    db.deleteKnowledge(id);

    return res.status(200).json({
      code: 0,
      message: '删除成功'
    });
  } catch (error) {
    console.error('Delete knowledge error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};
