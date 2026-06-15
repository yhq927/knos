const { cors, success, fail } = require('../_lib/response')
const { ensureSeed } = require('../_lib/seed')
const { signToken, comparePassword, sanitizeUser } = require('../_lib/auth')
const models = require('../_lib/models')

module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  await ensureSeed()

  const { email, password } = req.body || {}
  if (!email || !password) {
    return fail(res, 400, 400, '请输入邮箱和密码')
  }

  const user = await models.users.findByEmail(email)
  if (!user) {
    return fail(res, 401, 401, '邮箱或密码错误')
  }

  // 兼容旧的明文密码（无 passwordHash 字段）与新的哈希密码
  const ok = user.passwordHash
    ? await comparePassword(password, user.passwordHash)
    : user.password === password
  if (!ok) {
    return fail(res, 401, 401, '邮箱或密码错误')
  }

  const enterprise = await models.enterprises.findById(user.enterpriseId)
  const token = signToken(user)

  return success(res, {
    user: sanitizeUser(user),
    token,
    enterprise,
  }, '登录成功')
}
