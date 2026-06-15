const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// 路由：
// GET    /                  列表（分页/搜索/过滤）
// GET    /:id               详情
// POST   /                  创建
// PUT    /:id               更新
// DELETE /:id               删除
// GET    /:id/versions      版本列表
// GET    /:id/versions/:v   某版本
// POST   /:id/versions/:v/rollback  回滚

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments, query } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const body = req.body || {}

  // ---- 列表 ----
  if (req.method === 'GET' && segments.length === 0) {
    const result = await models.knowledge.listByEnterprise(
      enterpriseId,
      {
        keyword: query.keyword,
        businessUnitId: query.businessUnitId,
        contentType: query.contentType,
        visibility: query.visibility,
        status: query.status,
      },
      {
        page: Number(query.page) || 1,
        pageSize: Number(query.pageSize) || 20,
      }
    )
    return success(res, result.data || { list: result.list, total: result.total }, undefined, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    })
  }

  // ---- 版本列表 ----
  if (req.method === 'GET' && segments.length === 2 && segments[1] === 'versions') {
    const entry = await models.knowledge.findOne({ id: segments[0], enterpriseId })
    if (!entry) return fail(res, 404, 404, '知识不存在')
    const versions = await models.knowledge.listVersions(segments[0])
    return success(res, { list: versions, total: versions.length })
  }

  // ---- 某版本 ----
  if (req.method === 'GET' && segments.length === 3 && segments[1] === 'versions') {
    const entry = await models.knowledge.findOne({ id: segments[0], enterpriseId })
    if (!entry) return fail(res, 404, 404, '知识不存在')
    const version = await models.knowledge.getVersion(segments[0], segments[2])
    if (!version) return fail(res, 404, 404, '版本不存在')
    return success(res, version)
  }

  // ---- 回滚 ----
  if (
    req.method === 'POST' &&
    segments.length === 4 &&
    segments[1] === 'versions' &&
    segments[3] === 'rollback'
  ) {
    const entry = await models.knowledge.findOne({ id: segments[0], enterpriseId })
    if (!entry) return fail(res, 404, 404, '知识不存在')
    const updated = await models.knowledge.rollback(segments[0], segments[2], user)
    await models.activities.log(enterpriseId, '回滚了知识版本', {
      userId: user.id,
      user: user.name,
      resourceType: 'knowledge',
      resourceId: segments[0],
      details: { version: segments[2] },
    })
    return success(res, updated, '回滚成功')
  }

  // ---- 详情 ----
  if (req.method === 'GET' && segments.length === 1) {
    const entry = await models.knowledge.findOne({ id: segments[0], enterpriseId })
    if (!entry) return fail(res, 404, 404, '知识不存在')
    return success(res, entry)
  }

  // ---- 创建 ----
  if (req.method === 'POST' && segments.length === 0) {
    const { title, content, contentType, visibility, businessUnitId, status, metadata } = body
    if (!title || !content || !contentType) {
      return fail(res, 400, 400, '请填写标题、内容和类型')
    }
    const entry = await models.knowledge.create({
      enterpriseId,
      title,
      content,
      contentType,
      visibility: visibility || 'private',
      status: status || 'draft',
      businessUnitId: businessUnitId || null,
      metadata: metadata || {},
      createdBy: user.id,
    })
    await models.activities.log(enterpriseId, '创建了知识', {
      userId: user.id,
      user: user.name,
      resourceType: 'knowledge',
      resourceId: entry.id,
      details: { title },
    })
    return success(res, entry, '创建成功')
  }

  // ---- 更新 ----
  if (req.method === 'PUT' && segments.length === 1) {
    const entry = await models.knowledge.findOne({ id: segments[0], enterpriseId })
    if (!entry) return fail(res, 404, 404, '知识不存在')
    const { title, content, contentType, visibility, status, businessUnitId, metadata } = body
    const updated = await models.knowledge.updateWithVersion(segments[0], {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(contentType !== undefined && { contentType }),
      ...(visibility !== undefined && { visibility }),
      ...(status !== undefined && { status }),
      ...(businessUnitId !== undefined && { businessUnitId }),
      ...(metadata !== undefined && { metadata }),
    }, user)
    await models.activities.log(enterpriseId, '更新了知识', {
      userId: user.id,
      user: user.name,
      resourceType: 'knowledge',
      resourceId: segments[0],
      details: { title: updated.title },
    })
    return success(res, updated, '更新成功')
  }

  // ---- 删除 ----
  if (req.method === 'DELETE' && segments.length === 1) {
    const entry = await models.knowledge.findOne({ id: segments[0], enterpriseId })
    if (!entry) return fail(res, 404, 404, '知识不存在')
    await models.knowledge.remove(segments[0])
    await models.activities.log(enterpriseId, '删除了知识', {
      userId: user.id,
      user: user.name,
      resourceType: 'knowledge',
      resourceId: segments[0],
      details: { title: entry.title },
    })
    return success(res, null, '删除成功')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
