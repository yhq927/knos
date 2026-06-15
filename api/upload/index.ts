import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, fileUploads } from '../lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ code: 401, message: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      const uploads = Object.values(fileUploads)
        .filter((f: any) => f.enterpriseId === decoded.enterpriseId)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.status(200).json({ code: 0, message: 'success', data: { list: uploads, total: uploads.length } });
    }

    if (req.method === 'POST') {
      const { filename, fileSize, mimeType } = req.body;
      if (!filename) return res.status(400).json({ code: 400, message: 'Filename is required' });
      const id = `file_${Date.now()}`;
      fileUploads[id] = {
        id, enterpriseId: decoded.enterpriseId, userId: decoded.userId,
        filename, originalName: filename, fileSize, mimeType,
        status: 'processing', progress: 0, parsedCount: 0, createdAt: new Date().toISOString()
      };
      setTimeout(() => {
        if (fileUploads[id]) {
          fileUploads[id].status = 'completed';
          fileUploads[id].progress = 100;
          fileUploads[id].parsedCount = Math.floor(Math.random() * 10) + 1;
        }
      }, 3000);
      return res.status(200).json({ code: 0, message: 'Uploaded', data: fileUploads[id] });
    }

    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Server error' });
  }
}
