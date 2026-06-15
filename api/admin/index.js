const { cors, fail } = require('../_lib/response')
const authHandler = require('./auth')
const enterprisesHandler = require('./enterprises')
const statsHandler = require('./stats')

// 统一入口：Vercel rewrite 将 /api/admin/* 统一转发到此文件
// 由于 rewrite 后 req.url 不可靠，根据请求特征路由

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const body = req.body || {}

  // POST + { username, password } → 登录
  if (req.method === 'POST' && body.username && body.password) {
    return authHandler(req, res)
  }

  // POST + 无 username → 可能是邀请等其他 auth 操作
  if (req.method === 'POST') {
    return authHandler(req, res)
  }

  // GET + 带 query.id → 企业详情/编辑
  if (req.method === 'GET' && req.query && req.query.id) {
    return enterprisesHandler(req, res)
  }

  // PUT → 企业更新
  if (req.method === 'PUT') {
    return enterprisesHandler(req, res)
  }

  // GET 默认 → 统计
  return statsHandler(req, res)
}
