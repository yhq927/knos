const { cors, success, fail } = require('../_lib/response')
const { signToken, hashPassword, sanitizeUser } = require('../_lib/auth')
const models = require('../_lib/models')

module.exports = async (req, res) => {
  if (cors(req, res)) return
  if (req.method !== 'POST') return fail(res, 405, 405, 'Method not allowed')

  const { email, password, companyName, industry, size } = req.body || {}
  if (!email || !password || !companyName || !industry) {
    return fail(res, 400, 400, '请填写所有必填字段')
  }
  if (password.length < 8) {
    return fail(res, 400, 400, '密码至少8位')
  }

  const exists = await models.users.findByEmail(email)
  if (exists) {
    return fail(res, 400, 400, '该邮箱已注册')
  }

  const enterpriseId = models.genId('ent')
  const slug =
    companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 20) || models.genId('slug')

  const enterprise = await models.enterprises.insert({
    id: enterpriseId,
    name: companyName,
    industry,
    size: size || '',
    slug,
    planType: 'free',
    status: 'active',
    settings: { publicEnabled: false, welcomeMessage: '您好，我是您的智能助手' },
  })

  const userId = models.genId('user')
  const passwordHash = await hashPassword(password)
  const user = await models.users.insert({
    id: userId,
    email,
    passwordHash,
    name: email.split('@')[0],
    avatar: '',
    role: 'admin',
    status: 'active',
    enterpriseId,
  })

  // 默认业务单元
  await models.businessUnits.insert({
    id: models.genId('bu'),
    enterpriseId,
    name: '总部',
    description: '默认业务单元',
    status: 'active',
  })

  // 初始化默认采集目标
  await models.collectGoals.insert({
    id: models.genId('goal'),
    enterpriseId,
    name: '公司基本情况',
    description: '了解公司定位与核心业务',
    status: 'in_progress',
    progress: 0,
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
    id: models.genId('goal'),
    enterpriseId,
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

  await models.activities.log(enterpriseId, '注册创建了企业', {
    userId,
    user: user.name,
  })

  const token = signToken(user)
  return success(res, {
    user: sanitizeUser(user),
    token,
    enterprise,
  }, '注册成功')
}
