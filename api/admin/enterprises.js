const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAdmin } = require('../_lib/auth')
const models = require('../_lib/models')

// GET  /       企业列表
// PUT  /:id    更新企业（通过 query id）

module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (!(await requireAdmin(req, res))) return

  const { query } = parsePath(req)
  const body = req.body || {}

  if (req.method === 'GET') {
    const all = await models.enterprises.find()
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const limit = Number(query.limit) || all.length
    return success(res, { list: all.slice(0, limit), total: all.length })
  }

  if (req.method === 'PUT') {
    const id = query.id
    if (!id) return fail(res, 400, 400, '缺少企业ID')
    const enterprise = await models.enterprises.findById(id)
    if (!enterprise) return fail(res, 404, 404, '企业不存在')
    const updated = await models.enterprises.update(id, body)
    return success(res, updated, '更新成功')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
