const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET  /history          会话历史
// POST /                 同步问答（基于知识库检索）

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments, query } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const body = req.body || {}

  // ---- 会话历史 ----
  if (req.method === 'GET' && segments[0] === 'history') {
    const convs = await models.conversations.listByUser(user.id, {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 20,
    })
    return success(res, convs)
  }

  // ---- 同步问答 ----
  if (req.method === 'POST' && segments.length === 0) {
    const { message: userMsg, conversationId } = body
    if (!userMsg || !userMsg.trim()) {
      return fail(res, 400, 400, '请输入问题')
    }

    // 找或创建会话
    let convId = conversationId
    if (!convId) {
      const conv = await models.conversations.insert({
        id: models.genId('conv'),
        enterpriseId,
        userId: user.id,
        title: userMsg.slice(0, 50),
      })
      convId = conv.id
    }

    // 保存用户消息
    await models.messages.insert({
      id: models.genId('msg'),
      conversationId: convId,
      enterpriseId,
      userId: user.id,
      role: 'user',
      content: userMsg,
    })

    // 基于知识库检索回答
    const knowledgeList = await models.knowledge.find({ enterpriseId, status: 'published' })
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

    const sources = matched.map((k) => ({
      type: 'enterprise',
      name: k.title,
      knowledgeId: k.id,
    }))

    let answer = ''
    let confidence = 'low'
    if (matched.length > 0) {
      // 拼接回答
      answer = `根据企业知识库，我找到了以下相关信息：\n\n`
      matched.forEach((k, i) => {
        answer += `**${i + 1}. ${k.title}**\n${k.content}\n\n`
      })
      confidence = matched.length >= 2 ? 'high' : 'medium'
    } else {
      answer = `抱歉，当前企业知识库中没有找到与「${userMsg}」直接相关的答案。\n\n建议您：\n1. 补充相关知识条目\n2. 调整问题表述重新提问\n3. 联系团队管理员获取帮助`
      confidence = 'low'
    }

    const followUpQuestions =
      matched.length > 0
        ? [
            '能否再详细说明一下？',
            `还有哪些相关的知识？`,
            '如何获取更多帮助？',
          ]
        : ['如何添加新知识？', '有哪些支持的文档格式？']

    // 保存 AI 回答
    const aiMessage = await models.messages.insert({
      id: models.genId('msg'),
      conversationId: convId,
      enterpriseId,
      userId: user.id,
      role: 'assistant',
      content: answer,
      sources,
      confidence,
      followUpQuestions,
    })

    return success(res, {
      conversationId: convId,
      message: aiMessage,
    })
  }

  return fail(res, 405, 405, 'Method not allowed')
}
