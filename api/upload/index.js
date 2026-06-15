const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET    /                文件列表
// POST   /                上传（模拟接收）
// GET    /:id/status      文件状态
// POST   /:id/reparse     重新解析

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments, query } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const body = req.body || {}

  // ---- 列表 ----
  if (req.method === 'GET' && segments.length === 0) {
    const result = await models.fileUploads.paginate(
      { enterpriseId },
      {
        page: Number(query.page) || 1,
        pageSize: Number(query.pageSize) || 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }
    )
    return success(res, { list: result.list, total: result.total }, undefined, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    })
  }

  // ---- 文件状态 ----
  if (req.method === 'GET' && segments.length === 2 && segments[1] === 'status') {
    const file = await models.fileUploads.findOne({ id: segments[0], enterpriseId })
    if (!file) return fail(res, 404, 404, '文件不存在')
    return success(res, file)
  }

  // ---- 重新解析 ----
  if (req.method === 'POST' && segments.length === 2 && segments[1] === 'reparse') {
    const file = await models.fileUploads.findOne({ id: segments[0], enterpriseId })
    if (!file) return fail(res, 404, 404, '文件不存在')
    await models.fileUploads.update(segments[0], { status: 'processing', progress: 0 })
    // 模拟异步解析
    setTimeout(async () => {
      await models.fileUploads.update(segments[0], {
        status: 'completed',
        progress: 100,
        parsedCount: Math.floor(Math.random() * 10) + 1,
      })
    }, 3000)
    return success(res, null, '已重新提交解析')
  }

  // ---- 上传 ----
  if (req.method === 'POST' && segments.length === 0) {
    const { filename, originalName, fileSize, mimeType } = body
    const fname = originalName || filename || 'unnamed'
    const id = models.genId('file')
    const file = await models.fileUploads.insert({
      id,
      enterpriseId,
      userId: user.id,
      filename: fname,
      originalName: fname,
      fileSize: fileSize || 0,
      mimeType: mimeType || 'application/octet-stream',
      storagePath: '',
      status: 'processing',
      progress: 0,
      parsedCount: 0,
    })
    // 模拟异步解析
    setTimeout(async () => {
      await models.fileUploads.update(id, {
        status: 'completed',
        progress: 100,
        parsedCount: Math.floor(Math.random() * 10) + 1,
      })
    }, 3000)
    await models.activities.log(enterpriseId, '上传了文档', {
      userId: user.id,
      user: user.name,
      resourceType: 'file',
      resourceId: id,
      details: { filename: fname },
    })
    return success(res, file, '上传成功')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
