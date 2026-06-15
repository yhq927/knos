// 统一鉴权工具：基于 JWT
// - signToken(user)：签发 token，内嵌 userId / enterpriseId / role
// - verifyToken(token)：校验并返回 payload
// - requireAuth(req, res)：从请求头解析 token，返回 user 记录或返回 401 响应

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const models = require('./models')

const SECRET = process.env.JWT_SECRET || 'knosai-dev-secret-change-me'
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      enterpriseId: user.enterpriseId,
      role: user.role,
    },
    SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  )
}

function verifyToken(token) {
  if (!token) return null
  try {
    return jwt.verify(token, SECRET)
  } catch (e) {
    return null
  }
}

// 从请求头提取并校验 token，返回 user（含 enterpriseId）或 null
// 若返回 null 且 respond=true，会自动写入 401 响应
async function requireAuth(req, res, { respond = true } = {}) {
  const authHeader = req.headers && req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (respond) {
      res.status(401).json({ code: 401, message: '未提供认证Token' })
    }
    return null
  }
  const token = authHeader.substring(7)
  const payload = verifyToken(token)
  if (!payload || !payload.userId) {
    if (respond) {
      res.status(401).json({ code: 401, message: 'Token无效或已过期' })
    }
    return null
  }
  const user = await models.users.findById(payload.userId)
  if (!user) {
    if (respond) {
      res.status(401).json({ code: 401, message: '用户不存在' })
    }
    return null
  }
  // 附加 enterprise 引用，方便 handler 使用
  user.enterprise = await models.enterprises.findById(user.enterpriseId)
  return user
}

// 平台管理员 token 校验（admin_token 前缀）
async function requireAdmin(req, res) {
  const authHeader = req.headers && req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ code: 401, message: '未提供认证Token' })
    return null
  }
  const token = authHeader.substring(7)
  // admin token 格式：admin_token_<id>_<timestamp>，简单校验前缀
  if (!token.startsWith('admin_token_')) {
    res.status(401).json({ code: 401, message: '管理员Token无效' })
    return null
  }
  return token
}

// 移除敏感字段
function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, password, ...rest } = user
  return rest
}

module.exports = {
  SECRET,
  signToken,
  verifyToken,
  requireAuth,
  requireAdmin,
  sanitizeUser,
  hashPassword: (pwd) => bcrypt.hash(pwd, 10),
  comparePassword: (pwd, hash) => bcrypt.compare(pwd, hash),
}
