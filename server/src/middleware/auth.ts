import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'knosai-secret-key';

// Auth middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证Token'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
      enterpriseId: string;
    };

    // Attach user info to request
    (req as any).userId = decoded.userId;
    (req as any).email = decoded.email;
    (req as any).role = decoded.role;
    (req as any).enterpriseId = decoded.enterpriseId;

    next();
  } catch (error) {
    if ((error as any).name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: 'Token已过期'
      });
    }

    return res.status(401).json({
      code: 401,
      message: 'Token无效'
    });
  }
};

// Role middleware
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        code: 403,
        message: '无权限执行此操作'
      });
    }
    next();
  };
};
