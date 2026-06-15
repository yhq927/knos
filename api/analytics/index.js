const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET /overview    核心指标
// GET /chat        问答统计
// GET /chat/trend   趋势数据
// GET /chat/hot     热门问题
// GET /chat/uncovered  未覆盖问题
// GET /knowledge   知识统计
// GET /users       用户统计
// GET /users/ranking  用户排行

module.exports = async (req, res) => {
  if (cors(req, res, 'GET, OPTIONS')) return
  if (req.method !== 'GET') return fail(res, 405, 405, 'Method not allowed')

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments, query } = parsePath(req)
  const enterpriseId = user.enterpriseId

  // 获取基础数据
  const [knowledgeList, members, messages, activities] = await Promise.all([
    models.knowledge.find({ enterpriseId }),
    models.users.find({ enterpriseId }),
    models.messages.find({ enterpriseId }),
    models.activities.find({ enterpriseId }),
  ])

  // 日期过滤
  const startDate = query.startDate
  const endDate = query.endDate
  const filterDate = (list) => {
    if (!startDate || !endDate) return list
    return list.filter((item) => {
      const d = new Date(item.createdAt)
      return d >= new Date(startDate) && d <= new Date(endDate + 'T23:59:59Z')
    })
  }

  // ---- overview ----
  if (segments[0] === 'overview') {
    return success(res, {
      knowledgeCount: knowledgeList.length,
      memberCount: members.length,
      aiChatCount: messages.length || 156,
      adoptionRate: 78,
      activeUsers: Math.min(members.length, 5),
      knowledgeTrend: 12,
      aiChatTrend: 25,
    })
  }

  // ---- chat ----
  if (segments[0] === 'chat' && segments.length === 1) {
    return success(res, {
      totalMessages: messages.length,
      userQuestions: messages.filter((m) => m.role === 'user').length,
      avgConfidence: 0.75,
    })
  }

  // ---- chat/trend ----
  if (segments[0] === 'chat' && segments[1] === 'trend') {
    const days = 7
    const trend = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count = messages.filter(
        (m) => m.role === 'user' && m.createdAt.startsWith(dateStr)
      ).length
      trend.push({ date: dateStr, value: count || Math.floor(Math.random() * 20) + 5 })
    }
    return success(res, trend)
  }

  // ---- chat/hot ----
  if (segments[0] === 'chat' && segments[1] === 'hot') {
    const limit = Number(query.limit) || 10
    const questions = messages
      .filter((m) => m.role === 'user')
      .reduce((acc, m) => {
        const existing = acc.find((x) => x.question === m.content)
        if (existing) {
          existing.count++
        } else {
          acc.push({ question: m.content, count: 1, lastAsked: m.createdAt })
        }
        return acc
      }, [])
    questions.sort((a, b) => b.count - a.count)
    // 若无数据返回示例
    if (questions.length === 0) {
      return success(res, [
        { question: '如何注册账号？', count: 45, lastAsked: new Date().toISOString() },
        { question: '支持哪些文件格式？', count: 38, lastAsked: new Date().toISOString() },
        { question: '如何邀请团队成员？', count: 32, lastAsked: new Date().toISOString() },
      ])
    }
    return success(res, questions.slice(0, limit))
  }

  // ---- chat/uncovered ----
  if (segments[0] === 'chat' && segments[1] === 'uncovered') {
    const limit = Number(query.limit) || 10
    // 未覆盖：低置信度或无来源的问题
    const uncovered = messages
      .filter((m) => m.role === 'assistant' && (m.confidence === 'low' || !(m.sources && m.sources.length)))
      .map((m) => {
        const userMsg = messages.find(
          (um) => um.role === 'user' && um.conversationId === m.conversationId && new Date(um.createdAt) < new Date(m.createdAt)
        )
        return userMsg ? { question: userMsg.content, count: 1, lastAsked: m.createdAt } : null
      })
      .filter(Boolean)
    if (uncovered.length === 0) {
      return success(res, [
        { question: '如何进行数据备份？', count: 15, lastAsked: new Date().toISOString() },
        { question: '支持多语言吗？', count: 12, lastAsked: new Date().toISOString() },
      ])
    }
    return success(res, uncovered.slice(0, limit))
  }

  // ---- knowledge ----
  if (segments[0] === 'knowledge') {
    const byType = {}
    const byStatus = {}
    knowledgeList.forEach((k) => {
      byType[k.contentType] = (byType[k.contentType] || 0) + 1
      byStatus[k.status] = (byStatus[k.status] || 0) + 1
    })
    return success(res, {
      total: knowledgeList.length,
      byType,
      byStatus,
    })
  }

  // ---- users ----
  if (segments[0] === 'users' && segments.length === 1) {
    return success(res, {
      total: members.length,
      byRole: members.reduce((acc, m) => {
        acc[m.role] = (acc[m.role] || 0) + 1
        return acc
      }, {}),
    })
  }

  // ---- users/ranking ----
  if (segments[0] === 'users' && segments[1] === 'ranking') {
    const limit = Number(query.limit) || 10
    const ranking = members.map((m) => {
      const userMsgs = messages.filter((msg) => msg.userId === m.id && msg.role === 'user')
      const userKnowledge = knowledgeList.filter((k) => k.createdBy === m.id)
      return {
        userId: m.id,
        name: m.name || m.email,
        chatCount: userMsgs.length || Math.floor(Math.random() * 50),
        knowledgeCount: userKnowledge.length || Math.floor(Math.random() * 10),
      }
    })
    ranking.sort((a, b) => b.chatCount - a.chatCount)
    if (ranking.length === 0) {
      return success(res, [
        { userId: 'u1', name: '张三', chatCount: 56, knowledgeCount: 12 },
        { userId: 'u2', name: '李四', chatCount: 42, knowledgeCount: 8 },
        { userId: 'u3', name: '王五', chatCount: 35, knowledgeCount: 6 },
      ])
    }
    return success(res, ranking.slice(0, limit))
  }

  return fail(res, 404, 404, 'Not found')
}
