const { cors, success, fail, parsePath } = require('../_lib/response')
const models = require('../_lib/models')

// 路由：
// GET   /:slug             企业公开信息
// POST  /:slug/chat        公开问答
// GET   /:slug/knowledge   公开知识列表
// POST  /:slug/leads       提交线索

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const { segments } = parsePath(req)
  const slug = segments[0]
  if (!slug) return fail(res, 400, 400, '缺少企业标识')

  const enterprise = await models.enterprises.findBySlug(slug)
  if (!enterprise || enterprise.status !== 'active') {
    return fail(res, 404, 404, '企业不存在')
  }

  const enterpriseId = enterprise.id
  const body = req.body || {}

  // ---- 企业信息 ----
  if (req.method === 'GET' && segments.length === 1) {
    return success(res, {
      name: enterprise.name,
      industry: enterprise.industry,
      settings: enterprise.settings,
      slug: enterprise.slug,
    })
  }

  // ---- 公开问答 ----
  if (req.method === 'POST' && segments[1] === 'chat') {
    const { message: userMsg } = body
    if (!userMsg) return fail(res, 400, 400, '请输入问题')

    const knowledgeList = await models.knowledge.find({
      enterpriseId,
      status: 'published',
      visibility: 'public',
    })

    const keywords = userMsg.split(/[，。？！\s,?!.]+/).filter((w) => w.length >= 2)
    const matched = knowledgeList
      .map((k) => {
        let score = 0
        for (const kw of keywords) {
          const lower = kw.toLowerCase()
          if (k.title && k.title.toLowerCase().includes(lower)) score += 3
          if (k.content && k.content.toLowerCase().includes(lower)) score += 1
        }
        return { ...k, score }
      })
      .filter((k) => k.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    if (matched.length === 0) {
      return success(res, {
        message: `感谢您的咨询！关于「${userMsg}」的问题，我们暂未找到相关答案，请稍后再试或联系客服。`,
        sources: [],
        confidence: 'low',
        followUpQuestions: ['如何联系客服？', '在哪里查看常见问题？'],
      })
    }

    let answer = `感谢您的咨询！以下是相关信息：\n\n`
    matched.forEach((k, i) => {
      answer += `**${i + 1}. ${k.title}**\n${k.content}\n\n`
    })

    return success(res, {
      message: answer,
      sources: matched.map((k) => ({ type: 'enterprise', name: k.title })),
      confidence: matched.length >= 2 ? 'high' : 'medium',
      followUpQuestions: ['还有其他问题吗？', '如何获取更多帮助？'],
    })
  }

  // ---- 公开知识 ----
  if (req.method === 'GET' && segments[1] === 'knowledge') {
    const list = await models.knowledge.find({
      enterpriseId,
      status: 'published',
      visibility: 'public',
    })
    return success(res, { list: list.slice(0, 50), total: list.length })
  }

  // ---- 提交线索 ----
  if (req.method === 'POST' && segments[1] === 'leads') {
    const { name, email, phone, message: msg } = body
    const lead = await models.publicLeads.insert({
      id: models.genId('lead'),
      enterpriseId,
      name: name || '',
      email: email || '',
      phone: phone || '',
      message: msg || '',
    })
    return success(res, lead, '提交成功，我们会尽快联系您')
  }

  return fail(res, 404, 404, 'Not found')
}
