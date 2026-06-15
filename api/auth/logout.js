const { cors, success } = require('../_lib/response')

module.exports = async (req, res) => {
  if (cors(req, res)) return
  // 无状态 JWT：客户端自行丢弃 token 即可
  return success(res, null, '已退出登录')
}
