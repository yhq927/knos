// 数据访问层：基于 storage repository 的 model 集合
// 所有方法均为 async，调用方需 await

const { createRepository } = require('./storage')

const usersRepo = createRepository('users')
const enterprisesRepo = createRepository('enterprises')
const knowledgeRepo = createRepository('knowledge')
const knowledgeVersionsRepo = createRepository('knowledge_versions')
const businessUnitsRepo = createRepository('business_units')
const fileUploadsRepo = createRepository('file_uploads')
const conversationsRepo = createRepository('conversations')
const messagesRepo = createRepository('messages')
const notificationsRepo = createRepository('notifications')
const activitiesRepo = createRepository('activities')
const membersRepo = createRepository('members') // 邀请成员记录
const collectGoalsRepo = createRepository('collect_goals')
const collectQuestionsRepo = createRepository('collect_questions')
const publicLeadsRepo = createRepository('public_leads')

// 工具：生成唯一 id
function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

module.exports = {
  genId,

  // ---- 用户 ----
  users: {
    ...usersRepo,
    async findByEmail(email) {
      return usersRepo.findOne({ email })
    },
    // 列表带分页与关键字（按企业）
    async listByEnterprise(enterpriseId, options = {}) {
      return usersRepo.paginate({ enterpriseId }, options)
    },
  },

  // ---- 企业 ----
  enterprises: {
    ...enterprisesRepo,
    async findBySlug(slug) {
      return enterprisesRepo.findOne({ slug })
    },
  },

  // ---- 知识库 ----
  knowledge: {
    ...knowledgeRepo,
    async listByEnterprise(enterpriseId, filters = {}, options = {}) {
      const filter = { enterpriseId }
      if (filters.keyword) {
        const kw = filters.keyword
        filter.title = (v) => !!v && v.toLowerCase().includes(kw.toLowerCase())
        // 同时匹配 content，需在 paginate 之外处理；这里用自定义 find
      }
      if (filters.businessUnitId) filter.businessUnitId = filters.businessUnitId
      if (filters.contentType) filter.contentType = filters.contentType
      if (filters.visibility) filter.visibility = filters.visibility
      if (filters.status) filter.status = filters.status

      // 关键字需同时匹配 title 与 content，手写一次过滤
      const all = await knowledgeRepo.find({ enterpriseId })
      let list = all
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase()
        list = list.filter(
          (k) =>
            (k.title && k.title.toLowerCase().includes(kw)) ||
            (k.content && k.content.toLowerCase().includes(kw))
        )
      }
      if (filters.businessUnitId) list = list.filter((k) => k.businessUnitId === filters.businessUnitId)
      if (filters.contentType) list = list.filter((k) => k.contentType === filters.contentType)
      if (filters.visibility) list = list.filter((k) => k.visibility === filters.visibility)
      if (filters.status) list = list.filter((k) => k.status === filters.status)

      const { page = 1, pageSize = 20 } = options
      const total = list.length
      const start = (page - 1) * pageSize
      const paged = list.slice(start, start + pageSize)
      return { list: paged, total, page, pageSize }
    },
    // 创建并写入首版版本记录
    async create(data) {
      const id = data.id || genId('k')
      const doc = await knowledgeRepo.insert({ ...data, id, version: data.version || 1 })
      await knowledgeVersionsRepo.insert({
        id: genId('kv'),
        knowledgeId: id,
        version: doc.version,
        title: doc.title,
        content: doc.content,
        metadata: doc.metadata || {},
        createdBy: doc.createdBy,
      })
      return doc
    },
    // 更新并追加版本
    async updateWithVersion(id, patch, user) {
      const current = await knowledgeRepo.findById(id)
      if (!current) return null
      const nextVersion = (current.version || 1) + 1
      const updated = await knowledgeRepo.update(id, { ...patch, version: nextVersion })
      await knowledgeVersionsRepo.insert({
        id: genId('kv'),
        knowledgeId: id,
        version: nextVersion,
        title: updated.title,
        content: updated.content,
        metadata: updated.metadata || {},
        createdBy: user ? user.id : updated.createdBy,
      })
      return updated
    },
    async listVersions(knowledgeId) {
      const list = await knowledgeVersionsRepo.find({ knowledgeId })
      return list.sort((a, b) => b.version - a.version)
    },
    async getVersion(knowledgeId, version) {
      return knowledgeVersionsRepo.findOne({ knowledgeId, version: Number(version) })
    },
    // 回滚到指定版本
    async rollback(knowledgeId, version, user) {
      const v = await this.getVersion(knowledgeId, version)
      if (!v) return null
      const current = await knowledgeRepo.findById(knowledgeId)
      const nextVersion = ((current && current.version) || 1) + 1
      const updated = await knowledgeRepo.update(knowledgeId, {
        title: v.title,
        content: v.content,
        metadata: v.metadata || {},
        version: nextVersion,
      })
      await knowledgeVersionsRepo.insert({
        id: genId('kv'),
        knowledgeId,
        version: nextVersion,
        title: v.title,
        content: v.content,
        metadata: v.metadata || {},
        createdBy: user ? user.id : (current && current.createdBy),
        note: `回滚到 v${version}`,
      })
      return updated
    },
  },

  // ---- 业务单元 ----
  businessUnits: {
    ...businessUnitsRepo,
    async listByEnterprise(enterpriseId) {
      return businessUnitsRepo.find({ enterpriseId })
    },
  },

  // ---- 文件上传 ----
  fileUploads: {
    ...fileUploadsRepo,
    async listByEnterprise(enterpriseId, options = {}) {
      return fileUploadsRepo.paginate(
        { enterpriseId },
        { sortBy: 'createdAt', sortOrder: 'desc', ...options }
      )
    },
  },

  // ---- 会话与消息 ----
  conversations: {
    ...conversationsRepo,
    async listByUser(userId, options = {}) {
      return conversationsRepo.paginate(
        { userId },
        { sortBy: 'updatedAt', sortOrder: 'desc', ...options }
      )
    },
  },
  messages: {
    ...messagesRepo,
    async listByConversation(conversationId) {
      const list = await messagesRepo.find({ conversationId })
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    },
    async listByEnterprise(enterpriseId, options = {}) {
      return messagesRepo.paginate({ enterpriseId }, options)
    },
  },

  // ---- 通知 ----
  notifications: {
    ...notificationsRepo,
    async listByUser(userId, options = {}) {
      return notificationsRepo.paginate(
        { userId },
        { sortBy: 'createdAt', sortOrder: 'desc', ...options }
      )
    },
    async unreadCount(userId) {
      const list = await notificationsRepo.find({ userId, isRead: false })
      return list.length
    },
  },

  // ---- 活动日志 ----
  activities: {
    ...activitiesRepo,
    async log(enterpriseId, action, extra = {}) {
      return activitiesRepo.insert({
        id: genId('act'),
        enterpriseId,
        userId: extra.userId,
        action,
        resourceType: extra.resourceType || '',
        resourceId: extra.resourceId,
        details: extra.details || {},
        user: extra.user,
      })
    },
    async listByEnterprise(enterpriseId, options = {}) {
      return activitiesRepo.paginate(
        { enterpriseId },
        { sortBy: 'createdAt', sortOrder: 'desc', ...options }
      )
    },
  },

  // ---- 成员（邀请记录，与 users 区分；users 表存储正式用户） ----
  members: membersRepo,

  // ---- 知识采集 ----
  collectGoals: collectGoalsRepo,
  collectQuestions: collectQuestionsRepo,

  // ---- 对外服务线索 ----
  publicLeads: publicLeadsRepo,
}
