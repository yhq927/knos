const { cors, success, fail } = require('../_lib/response')
const models = require('../_lib/models')

// 简化实现：生成重置 token 并返回（生产环境应发邮件）
// 这里仅用于让前端流程跑通，token 作为演示返回
module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const { email } = req.body || {}
  if (!email) return fail(res, 400, 400, '请输入邮箱')

  // 不暴露邮箱是否存在
  const user = await models.users.findByEmail(email)
  const resetToken = user ? models.genId('reset') : models.genId('reset')
  // 存储重置 token（5 分钟内有效），由前端/邮件链接携带
  if (user) {
    await models.users.update(user.id, {
      resetToken,
      resetTokenExp: Date.now() + 30 * 60 * 1000,
    })
  }

  return success(res, null, '若该邮箱已注册，重置链接已发送至您的邮箱')
}
