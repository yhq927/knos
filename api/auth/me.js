const { cors, success, fail } = require('../_lib/response')
const { requireAuth, sanitizeUser } = require('../_lib/auth')

module.exports = async (req, res) => {
  if (cors(req, res, 'GET, OPTIONS')) return
  if (req.method !== 'GET') return fail(res, 405, 405, 'Method not allowed')

  const user = await requireAuth(req, res)
  if (!user) return

  return success(res, {
    user: sanitizeUser(user),
    enterprise: user.enterprise,
  })
}
