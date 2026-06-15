const { cors, success, fail, parsePath } = require('../_lib/response')
const { requireAuth } = require('../_lib/auth')
const models = require('../_lib/models')

// GET  /goals      采集目标列表
// GET  /current    当前待回答问题
// POST /answer     提交回答
// POST /skip       跳过问题

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const user = await requireAuth(req, res)
  if (!user) return

  const { segments } = parsePath(req)
  const enterpriseId = user.enterpriseId
  const body = req.body || {}

  // ---- 目标列表 ----
  if (req.method === 'GET' && segments[0] === 'goals') {
    const goals = await models.collectGoals.find({ enterpriseId })
    if (goals.length === 0) {
      // 无目标时返回注册时创建的默认目标
      return success(res, goals)
    }
    return success(res, goals)
  }

  // ---- 当前问题 ----
  if (req.method === 'GET' && segments[0] === 'current') {
    const goals = await models.collectGoals.find({ enterpriseId })
    // 找到进行中的目标
    const inProgress = goals.find((g) => g.status === 'in_progress')
    if (!inProgress) {
      // 尝试激活一个待开始的目标
      const pending = goals.find((g) => g.status === 'pending')
      if (pending) {
        await models.collectGoals.update(pending.id, { status: 'in_progress' })
        const q = pending.questions?.[pending.progress || 0]
        if (q) {
          return success(res, {
            id: `${pending.id}_q${pending.progress || 0}`,
            goalId: pending.id,
            content: q,
            type: 'open',
          })
        }
      }
      return success(res, null) // 全部完成
    }

    const qIndex = inProgress.progress || 0
    const q = inProgress.questions?.[qIndex]
    if (!q) {
      // 当前目标问题用完，标记完成，看下一个
      await models.collectGoals.update(inProgress.id, { status: 'completed' })
      const nextPending = goals.find((g) => g.status === 'pending')
      if (nextPending) {
        await models.collectGoals.update(nextPending.id, { status: 'in_progress' })
        const nq = nextPending.questions?.[0]
        if (nq) {
          return success(res, {
            id: `${nextPending.id}_q0`,
            goalId: nextPending.id,
            content: nq,
            type: 'open',
          })
        }
      }
      return success(res, null)
    }

    return success(res, {
      id: `${inProgress.id}_q${qIndex}`,
      goalId: inProgress.id,
      content: q,
      type: 'open',
    })
  }

  // ---- 提交回答 ----
  if (req.method === 'POST' && segments[0] === 'answer') {
    const { questionId, answer } = body
    if (!answer || !answer.trim()) return fail(res, 400, 400, '请输入回答')

    // questionId 格式：{goalId}_q{index}
    const [goalId] = (questionId || '').split('_q')
    const goal = await models.collectGoals.findById(goalId)
    if (!goal) return fail(res, 404, 404, '目标不存在')

    // 推进进度
    const newProgress = (goal.progress || 0) + 1
    const allDone = newProgress >= (goal.total || 0)
    await models.collectGoals.update(goalId, {
      progress: newProgress,
      status: allDone ? 'completed' : 'in_progress',
    })

    // 如果全部目标都完成了，检查一下
    if (allDone) {
      const remaining = await models.collectGoals.find({ enterpriseId, status: 'pending' })
      if (remaining.length > 0) {
        await models.collectGoals.update(remaining[0].id, { status: 'in_progress' })
      }
    }

    // 自动创建知识条目（将回答沉淀为知识）
    const question = goal.questions?.[goal.progress || 0] || ''
    await models.knowledge.create({
      enterpriseId,
      title: `采集知识：${question.slice(0, 40)}`,
      content: `**问题**：${question}\n\n**回答**：${answer}`,
      contentType: 'faq',
      visibility: 'team',
      status: 'draft',
      metadata: { source: 'collect', goalId },
      createdBy: user.id,
    })

    await models.activities.log(enterpriseId, '完成了知识采集', {
      userId: user.id,
      user: user.name,
      details: { question, answer: answer.slice(0, 100) },
    })

    return success(res, null, '回答已提交')
  }

  // ---- 跳过 ----
  if (req.method === 'POST' && segments[0] === 'skip') {
    const { questionId } = body
    const [goalId] = (questionId || '').split('_q')
    const goal = await models.collectGoals.findById(goalId)
    if (!goal) return fail(res, 404, 404, '目标不存在')

    const newProgress = (goal.progress || 0) + 1
    const allDone = newProgress >= (goal.total || 0)
    await models.collectGoals.update(goalId, {
      progress: newProgress,
      status: allDone ? 'completed' : 'in_progress',
    })
    return success(res, null, '已跳过')
  }

  return fail(res, 405, 405, 'Method not allowed')
}
