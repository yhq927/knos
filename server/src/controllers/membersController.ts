import { Request, Response } from 'express';
import { db } from '../models/database';

// Get members list
export const getMembers = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    
    // Get all users for this enterprise
    const users = Array.from(db['users'].values())
      .filter(u => u.enterpriseId === enterpriseId)
      .map(({ password, ...user }) => user);

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        list: users,
        total: users.length
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Invite member (mock)
export const inviteMember = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const enterpriseId = (req as any).enterpriseId;

    // In real app, send invitation email
    // For now, just return success
    return res.status(200).json({
      code: 0,
      message: '邀请已发送',
      data: {
        email,
        role,
        enterpriseId,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Invite member error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Update member role (mock)
export const updateMemberRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // In real app, update user role in database
    return res.status(200).json({
      code: 0,
      message: '角色更新成功',
      data: { id, role }
    });
  } catch (error) {
    console.error('Update member role error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Remove member (mock)
export const removeMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In real app, remove user from enterprise
    return res.status(200).json({
      code: 0,
      message: '成员已移除'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};
