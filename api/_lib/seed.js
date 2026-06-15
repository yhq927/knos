// 种子数据：首次访问时幂等写入
// demo 账号：
//   企业用户：test@example.com / 12345678
//   平台管理员：admin / admin123 (定义在 api/admin/auth.js)

const bcrypt = require('bcryptjs')
const models = require('./models')

let seeded = false

async function ensureSeed() {
  if (seeded) return
  seeded = true

  // 若已存在测试企业则跳过（KV 场景的幂等）
  const existing = await models.users.findByEmail('test@example.com')
  if (existing) return

  const now = new Date().toISOString()

  const enterprise = await models.enterprises.insert({
    id: 'ent_test',
    name: '测试公司',
    industry: 'technology',
    size: '11-50',
    description: '一家专注于 AI 技术的创新公司',
    slug: 'test-company',
    planType: 'free',
    status: 'active',
    contactPhone: '13800000000',
    contactEmail: 'contact@test.com',
    settings: { publicEnabled: false, welcomeMessage: '您好，我是您的智能助手' },
  })

  const passwordHash = await bcrypt.hash('12345678', 10)
  await models.users.insert({
    id: 'user_test',
    email: 'test@example.com',
    passwordHash,
    name: '测试用户',
    avatar: '',
    role: 'admin',
    status: 'active',
    enterpriseId: enterprise.id,
  })

  // 额外示例成员（仅用于列表展示）
  await models.users.insert({
    id: 'user_zhang',
    email: 'zhangsan@test.com',
    passwordHash: await bcrypt.hash('12345678', 10),
    name: '张三',
    role: 'editor',
    status: 'active',
    enterpriseId: enterprise.id,
  })
  await models.users.insert({
    id: 'user_li',
    email: 'lisi@test.com',
    passwordHash: await bcrypt.hash('12345678', 10),
    name: '李四',
    role: 'viewer',
    status: 'active',
    enterpriseId: enterprise.id,
  })

  // 业务单元
  await models.businessUnits.insert({
    id: 'bu_tech',
    enterpriseId: enterprise.id,
    name: '技术部',
    description: '产品研发',
    status: 'active',
  })
  await models.businessUnits.insert({
    id: 'bu_market',
    enterpriseId: enterprise.id,
    name: '市场部',
    description: '市场推广',
    status: 'active',
  })

  // 知识库示例
  await models.knowledge.create({
    id: 'k_company',
    enterpriseId: enterprise.id,
    title: '公司简介',
    content:
      '我们是一家专注于 AI 技术的创新公司，致力于帮助企业构建智能知识库。\n\n核心产品 KnosAI 提供知识采集、文档解析、AI 问答等能力。',
    contentType: 'guide',
    visibility: 'public',
    status: 'published',
    businessUnitId: 'bu_tech',
    metadata: {},
    createdBy: 'user_test',
  })
  await models.knowledge.create({
    id: 'k_product',
    enterpriseId: enterprise.id,
    title: '产品使用指南',
    content:
      '## 快速开始\n1. 注册账号并创建企业\n2. 通过 AI 引导问答或上传文档构建知识库\n3. 使用 AI 问答功能进行知识检索\n\n## 支持的文件格式\nWord、PDF、Excel、Markdown、TXT，单文件最大 100MB（专业版）。',
    contentType: 'sop',
    visibility: 'team',
    status: 'published',
    businessUnitId: 'bu_tech',
    metadata: {},
    createdBy: 'user_test',
  })
  await models.knowledge.create({
    id: 'k_faq',
    enterpriseId: enterprise.id,
    title: '常见问题：如何邀请团队成员？',
    content:
      '进入「设置 - 成员管理」，点击「邀请成员」，填写成员邮箱并选择角色（管理员/编辑者/只读），系统会发送邀请邮件。',
    contentType: 'faq',
    visibility: 'team',
    status: 'published',
    businessUnitId: 'bu_market',
    metadata: {},
    createdBy: 'user_zhang',
  })

  // 采集目标
  await models.collectGoals.insert({
    id: 'goal_company',
    enterpriseId: enterprise.id,
    name: '公司基本情况',
    description: '了解公司定位与核心业务',
    status: 'in_progress',
    progress: 2,
    total: 5,
    questions: [
      '公司的主要业务是什么？',
      '公司的目标客户群体是谁？',
      '公司相比竞品的核心优势是什么？',
      '公司的发展历程是怎样的？',
      '公司的未来规划是什么？',
    ],
  })
  await models.collectGoals.insert({
    id: 'goal_product',
    enterpriseId: enterprise.id,
    name: '产品与服务',
    description: '梳理公司提供的产品与服务',
    status: 'pending',
    progress: 0,
    total: 4,
    questions: [
      '公司主要提供哪些产品？',
      '产品的定价策略是怎样的？',
      '产品的交付周期通常是多久？',
      '售后服务包含哪些内容？',
    ],
  })
  await models.collectGoals.insert({
    id: 'goal_team',
    enterpriseId: enterprise.id,
    name: '团队与组织',
    description: '沉淀团队协作经验',
    status: 'pending',
    progress: 0,
    total: 3,
    questions: [
      '团队的组织架构是怎样的？',
      '新人入职的标准流程是什么？',
      '团队协作使用哪些工具？',
    ],
  })

  // 通知示例
  await models.notifications.insert({
    id: 'noti_1',
    userId: 'user_test',
    enterpriseId: enterprise.id,
    type: 'system',
    title: '欢迎使用 KnosAI',
    content: '您的企业知识库已创建成功，开始构建您的智能知识库吧！',
    isRead: false,
    metadata: {},
  })
  await models.notifications.insert({
    id: 'noti_2',
    userId: 'user_test',
    enterpriseId: enterprise.id,
    type: 'knowledge',
    title: '新知识条目',
    content: '张三 发布了新知识「常见问题：如何邀请团队成员？」',
    isRead: false,
    metadata: {},
  })

  // 活动日志
  await models.activities.log(enterprise.id, '创建了企业', {
    userId: 'user_test',
    user: '测试用户',
  })
  await models.activities.log(enterprise.id, '发布了知识', {
    userId: 'user_zhang',
    user: '张三',
    resourceType: 'knowledge',
    resourceId: 'k_faq',
    details: { title: '常见问题：如何邀请团队成员？' },
  })
}

module.exports = { ensureSeed }
