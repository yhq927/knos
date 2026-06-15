const { cors, fail } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// POST /chat/stream  SSE 流式问答
// 协议：data: {"type":"message_delta","data":{"content":"..."}}
//      data: {"type":"message_end","data":{"sources":[...],"confidence":"...","followUpQuestions":[...]}}
//      data: {"type":"error","data":{"message":"..."}}

module.exports = async (req, res) => {
  if (cors(req, res, 'POST, OPTIONS')) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const user = await requireAuth(req, res)
  if (!user) return

  const enterpriseId = user.enterpriseId
  const body = req.body || {}
  const userMsg = body.message
  const conversationId = body.conversationId

  if (!userMsg || !userMsg.trim()) {
    return fail(res, 400, 400, '请输入问题')
  }

  // 设定 SSE 头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  try {
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

    // 知识库检索
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

    // 构造完整回答
    let fullAnswer = ''
    if (matched.length > 0) {
      fullAnswer = `根据企业知识库，我找到了以下相关信息：\n\n`
      matched.forEach((k, i) => {
        fullAnswer += `**${i + 1}. ${k.title}**\n${k.content}\n\n`
      })
    } else {
      fullAnswer = `抱歉，当前企业知识库中没有找到与「${userMsg}」直接相关的答案。\n\n建议您：\n1. 补充相关知识条目\n2. 调整问题表述重新提问\n3. 联系团队管理员获取帮助`
    }

    const confidence = matched.length >= 2 ? 'high' : matched.length === 1 ? 'medium' : 'low'
    const followUpQuestions =
      matched.length > 0
        ? ['能否再详细说明一下？', '还有哪些相关的知识？', '如何获取更多帮助？']
        : ['如何添加新知识？', '有哪些支持的文档格式？']

    // 模拟流式输出：按字符分片发送
    const chunkSize = 4
    for (let i = 0; i < fullAnswer.length; i += chunkSize) {
      const chunk = fullAnswer.slice(i, i + chunkSize)
      res.write(`data: ${JSON.stringify({ type: 'message_delta', data: { content: chunk } })}\n\n`)
      // 小延迟模拟流式
      await new Promise((r) => setTimeout(r, 10))
    }

    // 发送结束标记
    res.write(
      `data: ${JSON.stringify({
        type: 'message_end',
        data: { sources, confidence, followUpQuestions },
      })}\n\n`
    )

    // 保存 AI 回答
    await models.messages.insert({
      id: models.genId('msg'),
      conversationId: convId,
      enterpriseId,
      userId: user.id,
      role: 'assistant',
      content: fullAnswer,
      sources,
      confidence,
      followUpQuestions,
    })

    res.end()
  } catch (err) {
    try {
      res.write(
        `data: ${JSON.stringify({ type: 'error', data: { message: '服务异常，请重试' } })}\n\n`
      )
    } catch {}
    res.end()
  }
}
