import { Request, Response } from 'express';
import { db } from '../models/database';

// Get overview stats
export const getOverview = async (req: Request, res: Response) => {
  try {
    const enterpriseId = (req as any).enterpriseId;
    const stats = db.getStats(enterpriseId);

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        ...stats,
        aiChatTrend: 25,
        knowledgeTrend: 12
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Get hot questions (mock)
export const getHotQuestions = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const questions = [
      { question: '如何注册账号？', count: 45, lastAsked: new Date().toISOString() },
      { question: '支持哪些文件格式？', count: 38, lastAsked: new Date().toISOString() },
      { question: '如何邀请团队成员？', count: 32, lastAsked: new Date().toISOString() },
      { question: '免费版有什么限制？', count: 28, lastAsked: new Date().toISOString() },
      { question: '如何导出知识库？', count: 25, lastAsked: new Date().toISOString() }
    ].slice(0, limitNum);

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: questions
    });
  } catch (error) {
    console.error('Get hot questions error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Get uncovered questions (mock)
export const getUncoveredQuestions = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const questions = [
      { question: '如何进行数据备份？', count: 15, lastAsked: new Date().toISOString() },
      { question: '支持多语言吗？', count: 12, lastAsked: new Date().toISOString() },
      { question: '如何自定义AI模型？', count: 10, lastAsked: new Date().toISOString() }
    ].slice(0, limitNum);

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: questions
    });
  } catch (error) {
    console.error('Get uncovered questions error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// Get user ranking (mock)
export const getUserRanking = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const users = [
      { userId: 'u1', name: '张三', chatCount: 56, knowledgeCount: 12 },
      { userId: 'u2', name: '李四', chatCount: 42, knowledgeCount: 8 },
      { userId: 'u3', name: '王五', chatCount: 35, knowledgeCount: 6 },
      { userId: 'u4', name: '赵六', chatCount: 28, knowledgeCount: 5 },
      { userId: 'u5', name: '钱七', chatCount: 22, knowledgeCount: 4 }
    ].slice(0, limitNum);

    return res.status(200).json({
      code: 0,
      message: 'success',
      data: users
    });
  } catch (error) {
    console.error('Get user ranking error:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};
