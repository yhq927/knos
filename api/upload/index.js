const { fileUploads, users } = require('../db');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  const parts = token.split('_');
  if (parts.length < 3) {
    return res.status(401).json({ code: 401, message: 'Token无效' });
  }

  const userId = parts[1];
  const user = Object.values(users).find(u => u.id === 'user_' + userId);
  if (!user) {
    return res.status(401).json({ code: 401, message: '用户不存在' });
  }

  const enterpriseId = user.enterpriseId;

  if (req.method === 'GET') {
    const uploads = Object.values(fileUploads)
      .filter(f => f.enterpriseId === enterpriseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.status(200).json({ code: 0, message: 'success', data: { list: uploads, total: uploads.length } });
  }

  if (req.method === 'POST') {
    const { filename, fileSize, mimeType } = req.body;
    if (!filename) return res.status(400).json({ code: 400, message: '文件名不能为空' });
    const id = 'file_' + Date.now();
    fileUploads[id] = {
      id, enterpriseId, userId: user.id,
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
    return res.status(200).json({ code: 0, message: '上传成功', data: fileUploads[id] });
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' });
};
