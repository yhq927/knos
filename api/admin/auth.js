const { cors, success, fail } = require('../_lib/response')

// 平台管理员登录（独立于企业用户体系，使用内存存储，硬编码）
const adminUsers = {
  admin: { id: 'admin_001', username: 'admin', password: 'admin123', role: 'super_admin' },
}

module.exports = async (req, res) => {
  if (cors(req, res, 'POST, OPTIONS')) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const { username, password } = req.body || {}
  if (!username || !password) return fail(res, 400, 400, '请输入账号和密码')

  const admin = adminUsers[username]
  if (!admin || admin.password !== password) {
    return fail(res, 401, 401, '账号或密码错误')
  }

  const token = `admin_token_${admin.id}_${Date.now()}`
  return success(res, {
    user: { id: admin.id, username: admin.username, role: admin.role },
    token,
  }, '登录成功')
}
