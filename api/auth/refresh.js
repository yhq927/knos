const { cors, success, fail } = require('../_lib/response')
const { requireAuth, signToken, sanitizeUser } = require('../_lib/auth')

module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const user = await requireAuth(req, res)
  if (!user) return

  const token = signToken(user)
  return success(res, { user: sanitizeUser(user), token, enterprise: user.enterprise }, '刷新成功')
}
