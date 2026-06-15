// 统一响应格式工具
// 成功：{ code: 0, message, data, meta? }
// 失败：{ code, message }

function success(res, data, message = 'success', meta) {
  const body = { code: 0, message, data }
  if (meta) body.meta = meta
  return res.status(200).json(body)
}

function fail(res, status, code, message) {
  // 支持两参调用 fail(res, code, message)，此时 http status = 200，业务 code 非 0
  if (message === undefined) {
    message = code
    code = status
    return res.status(200).json({ code, message })
  }
  return res.status(status).json({ code, message })
}

// 统一设置 CORS 与 OPTIONS 预检
function cors(req, res, methods = 'GET, POST, PUT, DELETE, OPTIONS') {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }
  return false
}

// 解析 path 参数：handler 收到的 req.url 形如 "/stats" 或 "/:id/versions/2"
// 返回 { segments: string[], query: object }
function parsePath(req) {
  const raw = req.url || ''
  const [pathPart, queryPart] = raw.split('?')
  const segments = pathPart.split('/').filter(Boolean)
  const query = {}
  if (queryPart) {
    for (const pair of queryPart.split('&')) {
      const [k, v] = pair.split('=')
      if (k) query[decodeURIComponent(k)] = v ? decodeURIComponent(v) : ''
    }
  }
  // 同时合并 req.query（vercel 提供）与解析结果
  Object.assign(query, req.query || {})
  return { segments, query }
}

module.exports = { success, fail, cors, parsePath }
