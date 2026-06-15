const { cors, success, fail } = require('../_lib/response')
const { requireAdmin } = require('../_lib/auth')
const models = require('../_lib/models')

module.exports = async (req, res) => {
  if (cors(req, res, 'GET, OPTIONS')) return
  if (req.method !== 'GET') return fail(res, 405, 405, 'Method not allowed')
  if (!(await requireAdmin(req, res))) return

  const [enterprises, users, knowledge] = await Promise.all([
    models.enterprises.find(),
    models.users.find(),
    models.knowledge.find(),
  ])

  return success(res, {
    totalEnterprises: enterprises.length,
    totalUsers: users.length,
    totalKnowledge: knowledge.length,
    dailyActive: 3,
    weeklyActive: 5,
    monthlyActive: 8,
  })
}
