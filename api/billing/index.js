const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET  /plan      当前套餐
// GET  /usage     使用量
// POST /upgrade   升级套餐

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const enterprise = await models.enterprises.findById(enterpriseId)

  if (req.method === 'GET' && segments[0] === 'plan') {
    const planType = (enterprise && enterprise.planType) || 'free'
    return success(res, {
      planType,
      name: planType === 'pro' ? '专业版' : planType === 'enterprise' ? '企业版' : '免费版',
      price: planType === 'pro' ? 299 : 0,
      features:
        planType === 'pro'
          ? ['不限成员', '不限知识', '1000次AI问答/月', '对外服务功能']
          : planType === 'enterprise'
            ? ['专业版全部功能', 'SSO', '私有化部署', 'SLA保障']
            : ['1个企业', '10个成员', '500条知识', '50次AI试用'],
    })
  }

  if (req.method === 'GET' && segments[0] === 'usage') {
    const knowledgeList = await models.knowledge.find({ enterpriseId })
    const members = await models.users.find({ enterpriseId })
    const isPro = enterprise && enterprise.planType === 'pro'
    return success(res, {
      aiUsed: 23,
      aiLimit: isPro ? 1000 : 50,
      storageUsed: 128,
      storageLimit: isPro ? 10000 : 500,
      memberCount: members.length,
      memberLimit: isPro ? 9999 : 10,
      knowledgeCount: knowledgeList.length,
      knowledgeLimit: isPro ? 99999 : 500,
    })
  }

  if (req.method === 'POST' && segments[0] === 'upgrade') {
    const { planType } = req.body || {}
    if (!['pro', 'enterprise'].includes(planType)) {
      return fail(res, 400, 400, '套餐类型无效')
    }
    await models.enterprises.update(enterpriseId, { planType })
    return success(
      res,
      { planType, paymentUrl: `https://example.com/pay?plan=${planType}` },
      '升级成功'
    )
  }

  return fail(res, 404, 404, 'Not found')
}
