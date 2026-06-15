const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET    /            列表
// POST   /            创建
// PUT    /:id         更新
// DELETE /:id         删除

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const body = req.body || {}

  if (req.method === 'GET' && segments.length === 0) {
    const list = await models.businessUnits.listByEnterprise(enterpriseId)
    return success(res, list)
  }

  if (req.method === 'POST' && segments.length === 0) {
    const { name, description, parentId } = body
    if (!name) return fail(res, 400, 400, '请输入业务单元名称')
    const unit = await models.businessUnits.insert({
      id: models.genId('bu'),
      enterpriseId,
      name,
      description: description || '',
      parentId: parentId || null,
      status: 'active',
    })
    return success(res, unit, '创建成功')
  }

  if (req.method === 'PUT' && segments.length === 1) {
    const target = await models.businessUnits.findOne({ id: segments[0], enterpriseId })
    if (!target) return fail(res, 404, 404, '业务单元不存在')
    const { name, description, status, parentId } = body
    const updated = await models.businessUnits.update(segments[0], {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(parentId !== undefined && { parentId }),
    })
    return success(res, updated, '更新成功')
  }

  if (req.method === 'DELETE' && segments.length === 1) {
    const target = await models.businessUnits.findOne({ id: segments[0], enterpriseId })
    if (!target) return fail(res, 404, 404, '业务单元不存在')
    await models.businessUnits.remove(segments[0])
    return success(res, null, '删除成功')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
