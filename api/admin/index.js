const { cors, fail, parsePath } = require('../_lib/response')
const authHandler = require('./auth')
const enterprisesHandler = require('./enterprises')
const statsHandler = require('./stats')

// 统一入口：根据路径分发到对应 handler
// /api/admin/auth/*      → auth.js
// /api/admin/enterprises → enterprises.js
// /api/admin/stats       → stats.js

module.exports = async (req, res) => {
  if (cors(req, res)) return

  const { segments } = parsePath(req)
  const sub = segments[0]

  if (sub === 'auth') {
    // 去掉 "auth" 前缀，让 auth handler 看到干净的路径
    req.url = '/' + segments.slice(1).join('/')
    return authHandler(req, res)
  }

  if (sub === 'enterprises') {
    req.url = '/' + segments.slice(1).join('/')
    return enterprisesHandler(req, res)
  }

  if (sub === 'stats') {
    req.url = '/' + segments.slice(1).join('/')
    return statsHandler(req, res)
  }

  return fail(res, 404, 404, 'Admin API not found')
}
