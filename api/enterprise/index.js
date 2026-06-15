const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET    /          企业信息
// GET    /stats     企业统计
// PUT    /          更新企业信息
// POST   /reset-slug 重置 slug
// POST   /test-key  测试 API Key（占位）

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments } = parsePath(req)
  const enterpriseId = user.enterpriseId

  // ---- 统计 ----
  if (req.method === 'GET' && segments[0] === 'stats') {
    const [knowledgeList, members, files] = await Promise.all([
      models.knowledge.find({ enterpriseId }),
      models.users.find({ enterpriseId }),
      models.fileUploads.find({ enterpriseId }),
    ])
    return success(res, {
      knowledgeCount: knowledgeList.length,
      memberCount: members.length,
      aiChatCount: 156,
      adoptionRate: 78,
      fileCount: files.length,
      knowledgeTrend: 12,
      aiChatTrend: 25,
    })
  }

  // ---- 企业信息 ----
  if (req.method === 'GET' && segments.length === 0) {
    const enterprise = await models.enterprises.findById(enterpriseId)
    if (!enterprise) return fail(res, 404, 404, '企业不存在')
    return success(res, enterprise)
  }

  // ---- 更新 ----
  if (req.method === 'PUT') {
    const enterprise = await models.enterprises.findById(enterpriseId)
    if (!enterprise) return fail(res, 404, 404, '企业不存在')
    const body = req.body || {}
    // apiKeys 与 settings 做合并处理
    let patch = { ...body }
    if (body.settings) {
      patch.settings = { ...(enterprise.settings || {}), ...body.settings }
    }
    const updated = await models.enterprises.update(enterpriseId, patch)
    return success(res, updated, '更新成功')
  }

  // ---- 重置 slug ----
  if (req.method === 'POST' && segments[0] === 'reset-slug') {
    const enterprise = await models.enterprises.findById(enterpriseId)
    const slug = models.genId('ent')
    const updated = await models.enterprises.update(enterpriseId, { slug })
    return success(res, { slug: updated.slug }, '已重置')
  }

  // ---- 测试 API Key ----
  if (req.method === 'POST' && segments[0] === 'test-key') {
    const { provider, apiKey } = req.body || {}
    if (!provider || !apiKey) return fail(res, 400, 400, '请填写服务商和 API Key')
    // 占位：简单校验非空即视为可用
    return success(res, { provider, valid: apiKey.length >= 10 }, 'API Key 测试成功')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
