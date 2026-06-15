const { cors, success, fail } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

module.exports = async (req, res) => {
  if (cors(req, res, 'POST, OPTIONS')) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const user = await requireAuth(req, res)
  if (!user) return

  const { messageId, type } = req.body || {}
  if (!messageId || !['helpful', 'not_helpful'].includes(type)) {
    return fail(res, 400, 400, '参数无效')
  }

  const msg = await models.messages.findById(messageId)
  if (!msg) return fail(res, 404, 404, '消息不存在')

  await models.messages.update(messageId, { feedback: type })
  return success(res, null, '感谢您的反馈')
}
