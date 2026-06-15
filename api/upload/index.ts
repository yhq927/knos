import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, fileUploads } from '../../_lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    // GET - 获取上传列表
    if (req.method === 'GET') {
      const uploads = Object.values(fileUploads)
        .filter(f => f.enterpriseId === decoded.enterpriseId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          list: uploads,
          total: uploads.length
        }
      });
    }

    // POST - 上传文件（模拟）
    if (req.method === 'POST') {
      const { filename, fileSize, mimeType } = req.body;

      if (!filename) {
        return res.status(400).json({ code: 400, message: '缺少文件信息' });
      }

      // 检查文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/markdown',
        'text/plain'
      ];

      if (!allowedTypes.includes(mimeType)) {
        return res.status(400).json({ code: 400, message: '不支持的文件类型' });
      }

      // 检查文件大小（免费版20MB，付费版100MB）
      const maxSize = 20 * 1024 * 1024;
      if (fileSize > maxSize) {
        return res.status(400).json({ code: 400, message: '文件大小超过限制' });
      }

      const id = `file_${Date.now()}`;
      const newFile = {
        id,
        enterpriseId: decoded.enterpriseId,
        userId: decoded.userId,
        filename,
        originalName: filename,
        fileSize,
        mimeType,
        status: 'processing',
        progress: 0,
        parsedCount: 0,
        errorMessage: '',
        createdAt: new Date().toISOString()
      };

      fileUploads[id] = newFile;

      // 模拟异步处理
      setTimeout(() => {
        if (fileUploads[id]) {
          fileUploads[id].status = 'completed';
          fileUploads[id].progress = 100;
          fileUploads[id].parsedCount = Math.floor(Math.random() * 10) + 1;
        }
      }, 3000);

      return res.status(200).json({
        code: 0,
        message: '上传成功',
        data: newFile
      });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
