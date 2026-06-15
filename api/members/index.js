const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth, sanitizeUser } = require('../_lib/auth')
const models = require('../_lib/models')

// GET    /             成员列表（实际来自 users 表）
// POST  /invite        邀请成员
// PUT   /:id/role      修改角色
// DELETE /:id          移除成员

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const body = req.body || {}

  // ---- 列表 ----
  if (req.method === 'GET' && segments.length === 0) {
    const list = await models.users.find({ enterpriseId })
    return success(res, {
      list: list.map(sanitizeUser),
      total: list.length,
    })
  }

  // ---- 邀请 ----
  if (req.method === 'POST' && segments[0] === 'invite') {
    const { email, role } = body
    if (!email) return fail(res, 400, 400, '请填写成员邮箱')
    const exists = await models.users.findByEmail(email)
    if (exists) return fail(res, 400, 400, '该邮箱已是成员')
    // 简化：直接创建一个只读账号（生产应发邮件让用户自行设置密码）
    const newUser = await models.users.insert({
      id: models.genId('user'),
      email,
      passwordHash: null,
      name: email.split('@')[0],
      role: role || 'viewer',
      status: 'pending',
      enterpriseId,
    })
    await models.activities.log(enterpriseId, '邀请了成员', {
      userId: user.id,
      user: user.name,
      details: { email, role },
    })
    return success(res, sanitizeUser(newUser), '邀请已发送')
  }

  // ---- 修改角色 ----
  if (req.method === 'PUT' && segments.length === 2 && segments[1] === 'role') {
    const target = await models.users.findById(segments[0])
    if (!target || target.enterpriseId !== enterpriseId) {
      return fail(res, 404, 404, '成员不存在')
    }
    const { role } = body
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return fail(res, 400, 400, '角色无效')
    }
    const updated = await models.users.update(segments[0], { role })
    return success(res, sanitizeUser(updated), '角色已更新')
  }

  // ---- 移除 ----
  if (req.method === 'DELETE' && segments.length === 1) {
    const target = await models.users.findById(segments[0])
    if (!target || target.enterpriseId !== enterpriseId) {
      return fail(res, 404, 404, '成员不存在')
    }
    if (target.id === user.id) {
      return fail(res, 400, 400, '不能移除自己')
    }
    await models.users.remove(segments[0])
    await models.activities.log(enterpriseId, '移除了成员', {
      userId: user.id,
      user: user.name,
      details: { email: target.email },
    })
    return success(res, null, '成员已移除')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
