const { cors, success, fail } = require('../_lib/response')
const { hashPassword } = require('../_lib/auth')
const models = require('../_lib/models')

module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const { token, newPassword } = req.body || {}
  if (!token || !newPassword) {
    return fail(res, 400, 400, '参数不完整')
  }
  if (newPassword.length < 8) {
    return fail(res, 400, 400, '密码至少8位')
  }

  const user = await models.users.findOne({ resetToken: token })
  if (!user || !user.resetTokenExp || user.resetTokenExp < Date.now()) {
    return fail(res, 400, 400, '重置链接无效或已过期')
  }

  const passwordHash = await hashPassword(newPassword)
  await models.users.update(user.id, {
    passwordHash,
    resetToken: null,
    resetTokenExp: null,
  })

  return success(res, null, '密码重置成功，请使用新密码登录')
}
