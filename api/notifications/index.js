const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET  /                 通知列表
// GET  /unread-count     未读数
// PUT  /:id/read         标记已读
// PUT  /read-all         全部已读
// DELETE /:id            删除
// GET  /settings         通知设置
// PUT  /settings         更新设置

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments, query } = parsePath(req)
  const userId = user.id
  const body = req.body || {}

  // ---- 未读数 ----
  if (req.method === 'GET' && segments[0] === 'unread-count') {
    const count = await models.notifications.unreadCount(userId)
    return success(res, { count })
  }

  // ---- 设置 ----
  if (req.method === 'GET' && segments[0] === 'settings') {
    return success(res, {
      emailEnabled: true,
      emailTypes: ['system', 'knowledge', 'invite'],
      pushEnabled: true,
      pushTypes: ['system'],
    })
  }

  if (req.method === 'PUT' && segments[0] === 'settings') {
    return success(res, body, '设置已保存')
  }

  // ---- 全部已读 ----
  if (req.method === 'PUT' && segments[0] === 'read-all') {
    const list = await models.notifications.find({ userId, isRead: false })
    for (const n of list) {
      await models.notifications.update(n.id, { isRead: true, readAt: new Date().toISOString() })
    }
    return success(res, null, '全部已读')
  }

  // ---- 标记已读 ----
  if (req.method === 'PUT' && segments.length === 2 && segments[1] === 'read') {
    const noti = await models.notifications.findOne({ id: segments[0], userId })
    if (!noti) return fail(res, 404, 404, '通知不存在')
    await models.notifications.update(segments[0], { isRead: true, readAt: new Date().toISOString() })
    return success(res, null, '已标记已读')
  }

  // ---- 删除 ----
  if (req.method === 'DELETE' && segments.length === 1) {
    const noti = await models.notifications.findOne({ id: segments[0], userId })
    if (!noti) return fail(res, 404, 404, '通知不存在')
    await models.notifications.remove(segments[0])
    return success(res, null, '已删除')
  }

  // ---- 列表 ----
  if (req.method === 'GET' && segments.length === 0) {
    const result = await models.notifications.listByUser(userId, {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 20,
    })
    return success(res, result)
  }

  return fail(res, 405, 405, 'Method not allowed')
}
