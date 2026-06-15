// 唯一 Serverless Function 入口
// 通过 vercel.json rewrite，所有 /api/* 请求路由到此文件
// Vercel Hobby 计划限制 12 个函数，故用单入口路由

const { cors, fail } = require('./_lib/response')
const { ensureSeed } = require('./_lib/seed')
const { requireAuth } = require('./_lib/auth')
const models = require('./_lib/models')

// ============================================================
// 路由表：module -> { method, segments条件, handler }
// handler 签名: async (req, res, ctx) => {}
// ctx 包含: { user, enterpriseId, segments, query, body }
// ============================================================

async function resolveUser(req, res) {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) return null
  return await requireAuth(req, res, { respond: false })
}

module.exports = async (req, res) => {
  // CORS
  if (cors(req, res)) return

  // 解析原始路径
  // 由于所有 /api/* rewrite 到此文件，req.url 应保留原始路径
  const rawUrl = req.url || req.headers['x-vercel-path'] || ''
  const cleanUrl = rawUrl.replace(/^\/api\/?/, '').split('?')[0]
  const segments = cleanUrl.split('/').filter(Boolean)
  const module = segments[0]
  const subSegments = segments.slice(1)

  const query = req.query || {}
  const body = req.body || {}

  // 辅助函数
  const ok = (data, message, meta) => {
    const payload = { code: 0, message: message || 'success', data }
    if (meta) payload.meta = meta
    return res.status(200).json(payload)
  }
  const err = (status, code, message) => res.status(status).json({ code, message })

  try {
    // ============================================================
    // AUTH 模块（无需认证的部分）
    // ============================================================
    if (module === 'auth') {
      await ensureSeed()
      const sub = subSegments[0]

      if (sub === 'login' && req.method === 'POST') {
        const { email, password } = body
        if (!email || !password) return err(400, 400, '请输入邮箱和密码')
        const user = await models.users.findByEmail(email)
        if (!user) return err(401, 401, '邮箱或密码错误')
        const { comparePassword } = require('./_lib/auth')
        const ok2 = user.passwordHash
          ? await comparePassword(password, user.passwordHash)
          : user.password === password
        if (!ok2) return err(401, 401, '邮箱或密码错误')
        const enterprise = await models.enterprises.findById(user.enterpriseId)
        const { signToken, sanitizeUser } = require('./_lib/auth')
        return ok({ user: sanitizeUser(user), token: signToken(user), enterprise }, '登录成功')
      }

      if (sub === 'register' && req.method === 'POST') {
        return handleRegister(body, ok, err)
      }

      if (sub === 'forgot-password' && req.method === 'POST') {
        const { email } = body
        if (email) {
          const user = await models.users.findByEmail(email)
          if (user) await models.users.update(user.id, { resetToken: models.genId('reset') })
        }
        return ok(null, '若该邮箱已注册，重置链接已发送至您的邮箱')
      }

      if (sub === 'reset-password' && req.method === 'POST') {
        const { token, newPassword } = body
        if (!token || !newPassword || newPassword.length < 8)
          return err(400, 400, '参数不完整或密码太短')
        const user = await models.users.findOne({ resetToken: token })
        if (!user) return err(400, 400, '重置链接无效或已过期')
        const { hashPassword } = require('./_lib/auth')
        await models.users.update(user.id, { passwordHash: await hashPassword(newPassword), resetToken: null })
        return ok(null, '密码重置成功')
      }

      // 以下需要认证
      const user = await resolveUser(req, res)
      if (!user) return err(401, 401, '未认证')

      if (sub === 'me' && req.method === 'GET') {
        const { sanitizeUser } = require('./_lib/auth')
        return ok({ user: sanitizeUser(user), enterprise: user.enterprise })
      }

      if (sub === 'refresh' && req.method === 'POST') {
        const { signToken, sanitizeUser } = require('./_lib/auth')
        return ok({ user: sanitizeUser(user), token: signToken(user), enterprise: user.enterprise }, '刷新成功')
      }

      if (sub === 'logout' && req.method === 'POST') {
        return ok(null, '已退出登录')
      }

      return err(404, 404, 'Auth API not found')
    }

    // ============================================================
    // 所有后续模块都需要认证
    // ============================================================
    const user = await resolveUser(req, res)
    if (!user) return err(401, 401, '未提供认证Token')
    const enterpriseId = user.enterpriseId

    // ---- ENTERPRISE ----
    if (module === 'enterprise') {
      if (req.method === 'GET' && subSegments[0] === 'stats') {
        const [kl, ml, fl] = await Promise.all([
          models.knowledge.find({ enterpriseId }),
          models.users.find({ enterpriseId }),
          models.fileUploads.find({ enterpriseId }),
        ])
        return ok({ knowledgeCount: kl.length, memberCount: ml.length, aiChatCount: 156, adoptionRate: 78, fileCount: fl.length })
      }
      if (req.method === 'GET') {
        return ok(await models.enterprises.findById(enterpriseId))
      }
      if (req.method === 'PUT') {
        const patch = { ...body }
        if (body.settings) {
          const ent = await models.enterprises.findById(enterpriseId)
          patch.settings = { ...((ent && ent.settings) || {}), ...body.settings }
        }
        return ok(await models.enterprises.update(enterpriseId, patch), '更新成功')
      }
      if (req.method === 'POST' && subSegments[0] === 'test-key') {
        const { provider, apiKey } = body
        if (!provider || !apiKey) return err(400, 400, '请填写服务商和 API Key')
        return ok({ provider, valid: apiKey.length >= 10 }, 'API Key 测试成功')
      }
    }

    // ---- KNOWLEDGE ----
    if (module === 'knowledge') {
      const id = subSegments[0]
      // 版本相关
      if (id && subSegments[1] === 'versions') {
        if (req.method === 'GET' && !subSegments[2]) {
          const entry = await models.knowledge.findOne({ id, enterpriseId })
          if (!entry) return err(404, 404, '知识不存在')
          return ok({ list: await models.knowledge.listVersions(id), total: (await models.knowledge.listVersions(id)).length })
        }
        if (req.method === 'GET' && subSegments[2]) {
          const v = await models.knowledge.getVersion(id, subSegments[2])
          if (!v) return err(404, 404, '版本不存在')
          return ok(v)
        }
        if (req.method === 'POST' && subSegments[3] === 'rollback') {
          return ok(await models.knowledge.rollback(id, subSegments[2], user), '回滚成功')
        }
      }
      if (req.method === 'GET' && id) {
        const entry = await models.knowledge.findOne({ id, enterpriseId })
        if (!entry) return err(404, 404, '知识不存在')
        return ok(entry)
      }
      if (req.method === 'GET') {
        const result = await models.knowledge.listByEnterprise(enterpriseId, {
          keyword: query.keyword, businessUnitId: query.businessUnitId,
          contentType: query.contentType, visibility: query.visibility, status: query.status,
        }, { page: Number(query.page) || 1, pageSize: Number(query.pageSize) || 20 })
        return ok({ list: result.list, total: result.total }, undefined, { page: result.page, pageSize: result.pageSize, total: result.total })
      }
      if (req.method === 'POST' && !id) {
        const { title, content, contentType, visibility, businessUnitId, status, metadata } = body
        if (!title || !content || !contentType) return err(400, 400, '请填写标题、内容和类型')
        return ok(await models.knowledge.create({
          enterpriseId, title, content, contentType,
          visibility: visibility || 'private', status: status || 'draft',
          businessUnitId: businessUnitId || null, metadata: metadata || {}, createdBy: user.id,
        }), '创建成功')
      }
      if (req.method === 'PUT' && id) {
        const entry = await models.knowledge.findOne({ id, enterpriseId })
        if (!entry) return err(404, 404, '知识不存在')
        return ok(await models.knowledge.updateWithVersion(id, body, user), '更新成功')
      }
      if (req.method === 'DELETE' && id) {
        const entry = await models.knowledge.findOne({ id, enterpriseId })
        if (!entry) return err(404, 404, '知识不存在')
        await models.knowledge.remove(id)
        return ok(null, '删除成功')
      }
    }

    // ---- MEMBERS ----
    if (module === 'members') {
      if (req.method === 'GET') {
        const list = await models.users.find({ enterpriseId })
        const { sanitizeUser } = require('./_lib/auth')
        return ok({ list: list.map(sanitizeUser), total: list.length })
      }
      if (req.method === 'POST' && subSegments[0] === 'invite') {
        const { email, role } = body
        if (!email) return err(400, 400, '请填写成员邮箱')
        if (await models.users.findByEmail(email)) return err(400, 400, '该邮箱已是成员')
        return ok(await models.users.insert({
          id: models.genId('user'), email, passwordHash: null,
          name: email.split('@')[0], role: role || 'viewer', status: 'pending', enterpriseId,
        }), '邀请已发送')
      }
      if (req.method === 'PUT' && subSegments[1] === 'role') {
        const target = await models.users.findById(subSegments[0])
        if (!target || target.enterpriseId !== enterpriseId) return err(404, 404, '成员不存在')
        if (!['admin', 'editor', 'viewer'].includes(body.role)) return err(400, 400, '角色无效')
        const { sanitizeUser } = require('./_lib/auth')
        return ok(sanitizeUser(await models.users.update(subSegments[0], { role: body.role })), '角色已更新')
      }
      if (req.method === 'DELETE') {
        const target = await models.users.findById(subSegments[0])
        if (!target || target.enterpriseId !== enterpriseId) return err(404, 404, '成员不存在')
        if (target.id === user.id) return err(400, 400, '不能移除自己')
        await models.users.remove(subSegments[0])
        return ok(null, '成员已移除')
      }
    }

    // ---- BUSINESS UNITS ----
    if (module === 'business-units') {
      if (req.method === 'GET') {
        return ok(await models.businessUnits.listByEnterprise(enterpriseId))
      }
      if (req.method === 'POST') {
        const { name, description, parentId } = body
        if (!name) return err(400, 400, '请输入业务单元名称')
        return ok(await models.businessUnits.insert({
          id: models.genId('bu'), enterpriseId, name, description: description || '',
          parentId: parentId || null, status: 'active',
        }), '创建成功')
      }
      if (req.method === 'PUT') {
        const target = await models.businessUnits.findOne({ id: subSegments[0], enterpriseId })
        if (!target) return err(404, 404, '业务单元不存在')
        return ok(await models.businessUnits.update(subSegments[0], body), '更新成功')
      }
      if (req.method === 'DELETE') {
        await models.businessUnits.remove(subSegments[0])
        return ok(null, '删除成功')
      }
    }

    // ---- UPLOAD ----
    if (module === 'upload') {
      if (req.method === 'GET' && subSegments[1] === 'status') {
        return ok(await models.fileUploads.findOne({ id: subSegments[0], enterpriseId }))
      }
      if (req.method === 'POST' && subSegments[1] === 'reparse') {
        await models.fileUploads.update(subSegments[0], { status: 'processing', progress: 0 })
        setTimeout(async () => {
          await models.fileUploads.update(subSegments[0], { status: 'completed', progress: 100, parsedCount: Math.floor(Math.random() * 10) + 1 })
        }, 3000)
        return ok(null, '已重新提交解析')
      }
      if (req.method === 'GET') {
        const result = await models.fileUploads.paginate({ enterpriseId }, {
          page: Number(query.page) || 1, pageSize: Number(query.pageSize) || 20,
          sortBy: 'createdAt', sortOrder: 'desc',
        })
        return ok({ list: result.list, total: result.total }, undefined, { page: result.page, pageSize: result.pageSize, total: result.total })
      }
      if (req.method === 'POST') {
        const { filename, originalName, fileSize, mimeType } = body
        const fname = originalName || filename || 'unnamed'
        return ok(await models.fileUploads.insert({
          id: models.genId('file'), enterpriseId, userId: user.id,
          filename: fname, originalName: fname, fileSize: fileSize || 0,
          mimeType: mimeType || 'application/octet-stream', storagePath: '',
          status: 'processing', progress: 0, parsedCount: 0,
        }), '上传成功')
      }
    }

    // ---- ANALYTICS ----
    if (module === 'analytics') {
      const [kl, ml, msgs] = await Promise.all([
        models.knowledge.find({ enterpriseId }),
        models.users.find({ enterpriseId }),
        models.messages.find({ enterpriseId }),
      ])
      if (subSegments[0] === 'overview') {
        return ok({ knowledgeCount: kl.length, memberCount: ml.length, aiChatCount: msgs.length || 156, adoptionRate: 78, activeUsers: Math.min(ml.length, 5) })
      }
      if (subSegments[0] === 'chat' && subSegments[1] === 'hot') {
        return ok([{ question: '如何注册账号？', count: 45, lastAsked: new Date().toISOString() }, { question: '支持哪些文件格式？', count: 38, lastAsked: new Date().toISOString() }])
      }
      if (subSegments[0] === 'chat' && subSegments[1] === 'uncovered') {
        return ok([{ question: '如何进行数据备份？', count: 15, lastAsked: new Date().toISOString() }])
      }
      if (subSegments[0] === 'users' && subSegments[1] === 'ranking') {
        return ok(ml.map(m => ({ userId: m.id, name: m.name || m.email, chatCount: Math.floor(Math.random() * 50), knowledgeCount: Math.floor(Math.random() * 10) })))
      }
      if (subSegments[0] === 'chat') return ok({ totalMessages: msgs.length })
      if (subSegments[0] === 'knowledge') return ok({ total: kl.length })
      if (subSegments[0] === 'users') return ok({ total: ml.length })
    }

    // ---- BILLING ----
    if (module === 'billing') {
      const enterprise = await models.enterprises.findById(enterpriseId)
      const planType = (enterprise && enterprise.planType) || 'free'
      if (subSegments[0] === 'plan') {
        return ok({ planType, name: planType === 'pro' ? '专业版' : '免费版', price: planType === 'pro' ? 299 : 0 })
      }
      if (subSegments[0] === 'usage') {
        const isPro = planType === 'pro'
        const kl = await models.knowledge.find({ enterpriseId })
        const ml = await models.users.find({ enterpriseId })
        return ok({ aiUsed: 23, aiLimit: isPro ? 1000 : 50, memberCount: ml.length, memberLimit: isPro ? 9999 : 10, knowledgeCount: kl.length, knowledgeLimit: isPro ? 99999 : 500 })
      }
      if (subSegments[0] === 'upgrade' && req.method === 'POST') {
        if (!['pro', 'enterprise'].includes(body.planType)) return err(400, 400, '套餐类型无效')
        await models.enterprises.update(enterpriseId, { planType: body.planType })
        return ok({ planType: body.planType, paymentUrl: 'https://example.com/pay?plan=' + body.planType }, '升级成功')
      }
    }

    // ---- CHAT ----
    if (module === 'chat') {
      if (subSegments[0] === 'history' && req.method === 'GET') {
        const convs = await models.conversations.listByUser(user.id, { page: Number(query.page) || 1, pageSize: Number(query.pageSize) || 20 })
        return ok(cons)
      }
      if (subSegments[0] === 'feedback' && req.method === 'POST') {
        if (!body.messageId || !['helpful', 'not_helpful'].includes(body.type)) return err(400, 400, '参数无效')
        await models.messages.update(body.messageId, { feedback: body.type })
        return ok(null, '感谢您的反馈')
      }
      if (subSegments[0] === 'stream' && req.method === 'POST') {
        // SSE 流式问答
        return handleStreamChat(req, res, user)
      }
      if (req.method === 'POST') {
        // 同步问答
        const { message: userMsg, conversationId } = body
        if (!userMsg || !userMsg.trim()) return err(400, 400, '请输入问题')
        let convId = conversationId
        if (!convId) {
          const conv = await models.conversations.insert({ id: models.genId('conv'), enterpriseId, userId: user.id, title: userMsg.slice(0, 50) })
          convId = conv.id
        }
        await models.messages.insert({ id: models.genId('msg'), conversationId: convId, enterpriseId, userId: user.id, role: 'user', content: userMsg })
        const result = await searchKnowledge(enterpriseId, userMsg)
        await models.messages.insert({ id: models.genId('msg'), conversationId: convId, enterpriseId, userId: user.id, role: 'assistant', content: result.answer, sources: result.sources, confidence: result.confidence, followUpQuestions: result.followUpQuestions })
        return ok({ conversationId: convId, message: { content: result.answer, sources: result.sources, confidence: result.confidence, followUpQuestions: result.followUpQuestions } })
      }
    }

    // ---- COLLECT ----
    if (module === 'collect') {
      if (subSegments[0] === 'goals' && req.method === 'GET') {
        return ok(await models.collectGoals.find({ enterpriseId }))
      }
      if (subSegments[0] === 'current' && req.method === 'GET') {
        const goals = await models.collectGoals.find({ enterpriseId })
        const inProgress = goals.find(g => g.status === 'in_progress') || goals.find(g => g.status === 'pending')
        if (!inProgress) return ok(null)
        const qIndex = inProgress.progress || 0
        const q = inProgress.questions && inProgress.questions[qIndex]
        if (!q) return ok(null)
        return ok({ id: inProgress.id + '_q' + qIndex, goalId: inProgress.id, content: q, type: 'open' })
      }
      if (subSegments[0] === 'answer' && req.method === 'POST') {
        const { questionId, answer } = body
        if (!answer || !answer.trim()) return err(400, 400, '请输入回答')
        const goalId = (questionId || '').split('_q')[0]
        const goal = await models.collectGoals.findById(goalId)
        if (!goal) return err(404, 404, '目标不存在')
        const newProgress = (goal.progress || 0) + 1
        const allDone = newProgress >= (goal.total || 0)
        await models.collectGoals.update(goalId, { progress: newProgress, status: allDone ? 'completed' : 'in_progress' })
        const question = (goal.questions && goal.questions[goal.progress || 0]) || ''
        await models.knowledge.create({ enterpriseId, title: '采集知识：' + question.slice(0, 40), content: '**问题**：' + question + '\n\n**回答**：' + answer, contentType: 'faq', visibility: 'team', status: 'draft', metadata: { source: 'collect', goalId }, createdBy: user.id })
        return ok(null, '回答已提交')
      }
      if (subSegments[0] === 'skip' && req.method === 'POST') {
        const { questionId } = body
        const goalId = (questionId || '').split('_q')[0]
        const goal = await models.collectGoals.findById(goalId)
        if (!goal) return err(404, 404, '目标不存在')
        const newProgress = (goal.progress || 0) + 1
        const allDone = newProgress >= (goal.total || 0)
        await models.collectGoals.update(goalId, { progress: newProgress, status: allDone ? 'completed' : 'in_progress' })
        return ok(null, '已跳过')
      }
    }

    // ---- NOTIFICATIONS ----
    if (module === 'notifications') {
      if (subSegments[0] === 'unread-count' && req.method === 'GET') {
        return ok({ count: await models.notifications.unreadCount(user.id) })
      }
      if (subSegments[0] === 'settings') {
        if (req.method === 'GET') return ok({ emailEnabled: true, pushEnabled: true })
        return ok(body, '设置已保存')
      }
      if (subSegments[0] === 'read-all' && req.method === 'PUT') {
        const list = await models.notifications.find({ userId: user.id, isRead: false })
        for (const n of list) await models.notifications.update(n.id, { isRead: true, readAt: new Date().toISOString() })
        return ok(null, '全部已读')
      }
      if (subSegments[1] === 'read' && req.method === 'PUT') {
        await models.notifications.update(subSegments[0], { isRead: true, readAt: new Date().toISOString() })
        return ok(null, '已标记已读')
      }
      if (req.method === 'DELETE') {
        await models.notifications.remove(subSegments[0])
        return ok(null, '已删除')
      }
      if (req.method === 'GET') {
        return ok(await models.notifications.listByUser(user.id, { page: Number(query.page) || 1, pageSize: Number(query.pageSize) || 20 }))
      }
    }

    // ---- PUBLIC（无需认证，对外服务）----
    if (module === 'public') {
      // 重新解析：public 模块第一个 segment 是 slug
      const slug = module && segments[1] // segments[0]='public', segments[1]=slug
      const action = segments[2]
      const enterprise = await models.enterprises.findBySlug(slug)
      if (!enterprise) return err(404, 404, '企业不存在')
      const eid = enterprise.id
      if (req.method === 'GET' && !action) {
        return ok({ name: enterprise.name, industry: enterprise.industry, settings: enterprise.settings, slug: enterprise.slug })
      }
      if (action === 'chat' && req.method === 'POST') {
        const result = await searchKnowledge(eid, body.message, 'public')
        return ok(result)
      }
      if (action === 'knowledge' && req.method === 'GET') {
        const list = await models.knowledge.find({ enterpriseId: eid, status: 'published', visibility: 'public' })
        return ok({ list: list.slice(0, 50), total: list.length })
      }
      if (action === 'leads' && req.method === 'POST') {
        return ok(await models.publicLeads.insert({ id: models.genId('lead'), enterpriseId: eid, name: body.name || '', email: body.email || '', phone: body.phone || '', message: body.message || '' }), '提交成功')
      }
    }

    // ---- ADMIN（平台管理，需 admin token）----
    if (module === 'admin') {
      const adminUsers = { admin: { id: 'admin_001', username: 'admin', password: 'admin123', role: 'super_admin' } }
      const sub = subSegments[0]

      // 登录（特殊：不需要 admin token）
      if (sub === 'auth' && req.method === 'POST') {
        const { username, password } = body
        if (!username || !password) return err(400, 400, '请输入账号和密码')
        const admin = adminUsers[username]
        if (!admin || admin.password !== password) return err(401, 401, '账号或密码错误')
        return ok({ user: { id: admin.id, username: admin.username, role: admin.role }, token: 'admin_token_' + admin.id + '_' + Date.now() }, '登录成功')
      }

      // 其他 admin 接口需要 admin token
      const token = (req.headers.authorization || '').replace('Bearer ', '')
      if (!token.startsWith('admin_token_')) return err(401, 401, '管理员Token无效')

      if (sub === 'stats' && req.method === 'GET') {
        const [ents, usrs, knw] = await Promise.all([models.enterprises.find(), models.users.find(), models.knowledge.find()])
        return ok({ totalEnterprises: ents.length, totalUsers: usrs.length, totalKnowledge: knw.length, dailyActive: 3, weeklyActive: 5, monthlyActive: 8 })
      }
      if (sub === 'enterprises') {
        if (req.method === 'GET') {
          const all = await models.enterprises.find()
          all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          const limit = Number(query.limit) || all.length
          return ok({ list: all.slice(0, limit), total: all.length })
        }
        if (req.method === 'PUT') {
          const id = query.id
          if (!id) return err(400, 400, '缺少企业ID')
          return ok(await models.enterprises.update(id, body), '更新成功')
        }
      }
    }

    return err(404, 404, 'API not found: /' + module)
  } catch (e) {
    if (!res.headersSent) {
      return err(500, 500, 'Internal error: ' + e.message)
    }
  }
}

// ============================================================
// 辅助函数
// ============================================================
async function handleRegister(body, ok, err) {
  const { email, password, companyName, industry, size } = body
  if (!email || !password || !companyName || !industry) return err(400, 400, '请填写所有必填字段')
  if (password.length < 8) return err(400, 400, '密码至少8位')
  if (await models.users.findByEmail(email)) return err(400, 400, '该邮箱已注册')

  const { hashPassword, signToken, sanitizeUser } = require('./_lib/auth')
  const enterpriseId = models.genId('ent')
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 20) || models.genId('slug')
  const enterprise = await models.enterprises.insert({ id: enterpriseId, name: companyName, industry, size: size || '', slug, planType: 'free', status: 'active', settings: { publicEnabled: false, welcomeMessage: '您好，我是您的智能助手' } })
  const userId = models.genId('user')
  const user = await models.users.insert({ id: userId, email, passwordHash: await hashPassword(password), name: email.split('@')[0], avatar: '', role: 'admin', status: 'active', enterpriseId })
  await models.collectGoals.insert({ id: models.genId('goal'), enterpriseId, name: '公司基本情况', description: '了解公司定位', status: 'in_progress', progress: 0, total: 5, questions: ['公司的主要业务是什么？', '目标客户是谁？', '核心优势是什么？', '发展历程？', '未来规划？'] })
  return ok({ user: sanitizeUser(user), token: signToken(user), enterprise }, '注册成功')
}

async function searchKnowledge(enterpriseId, userMsg, visibility) {
  const filter = { enterpriseId, status: 'published' }
  if (visibility) filter.visibility = visibility
  const knowledgeList = await models.knowledge.find(filter)
  const keywords = userMsg.split(/[，。？！\s,?!.]+/).filter(w => w.length >= 2)
  const matched = knowledgeList.map(k => {
    let score = 0
    for (const kw of keywords) {
      const lower = kw.toLowerCase()
      if (k.title && k.title.toLowerCase().includes(lower)) score += 3
      if (k.content && k.content.toLowerCase().includes(lower)) score += 1
    }
    return Object.assign({}, k, { score })
  }).filter(k => k.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)

  const sources = matched.map(k => ({ type: 'enterprise', name: k.title, knowledgeId: k.id }))
  let answer = ''
  let confidence = 'low'
  if (matched.length > 0) {
    answer = '根据企业知识库，我找到了以下相关信息：\n\n'
    matched.forEach((k, i) => { answer += '**' + (i + 1) + '. ' + k.title + '**\n' + k.content + '\n\n' })
    confidence = matched.length >= 2 ? 'high' : 'medium'
  } else {
    answer = '抱歉，当前企业知识库中没有找到与「' + userMsg + '」直接相关的答案。'
    confidence = 'low'
  }
  const followUpQuestions = matched.length > 0 ? ['能否再详细说明一下？', '还有哪些相关的知识？'] : ['如何添加新知识？', '有哪些支持的文档格式？']
  return { message: answer, answer, sources, confidence, followUpQuestions }
}

async function handleStreamChat(req, res, user) {
  const enterpriseId = user.enterpriseId
  const body = req.body || {}
  const userMsg = body.message
  if (!userMsg || !userMsg.trim()) {
    res.status(400).json({ code: 400, message: '请输入问题' })
    return
  }
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  try {
    const result = await searchKnowledge(enterpriseId, userMsg)
    const chunkSize = 4
    for (let i = 0; i < result.answer.length; i += chunkSize) {
      const chunk = result.answer.slice(i, i + chunkSize)
      res.write('data: ' + JSON.stringify({ type: 'message_delta', data: { content: chunk } }) + '\n\n')
      await new Promise(r => setTimeout(r, 10))
    }
    res.write('data: ' + JSON.stringify({ type: 'message_end', data: { sources: result.sources, confidence: result.confidence, followUpQuestions: result.followUpQuestions } }) + '\n\n')
    res.end()
  } catch (e) {
    try { res.write('data: ' + JSON.stringify({ type: 'error', data: { message: '服务异常' } }) + '\n\n') } catch (_) {}
    res.end()
  }
}
