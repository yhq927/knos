// 统一存储抽象层
// - 内存实现 (MemoryStore)：零配置，开发/测试默认
// - Redis 实现 (RedisStore)：基于 @upstash/redis，配置 UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN 时自动启用
// 通过 getStore() 按 collection 名称返回 repository，所有方法均为 async

const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

let redisClient = null
function getRedis() {
  if (!redisClient) {
    const { Redis } = require('@upstash/redis')
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redisClient
}

// ----------------------------------------------------------------------------
// 内存实现：每个 collection 维护一个 Map
// ----------------------------------------------------------------------------
function createMemoryCollection() {
  const map = new Map()
  return {
    async get(id) {
      const v = map.get(id)
      return v ? JSON.parse(JSON.stringify(v)) : null
    },
    async set(id, value) {
      map.set(id, JSON.parse(JSON.stringify(value)))
    },
    async remove(id) {
      map.delete(id)
    },
    async all() {
      return Array.from(map.values()).map((v) => JSON.parse(JSON.stringify(v)))
    },
    async count() {
      return map.size
    },
    async clear() {
      map.clear()
    },
  }
}

// ----------------------------------------------------------------------------
// Redis 实现：每条数据独立 key，用 set 维护索引
// ----------------------------------------------------------------------------
function createRedisCollection(name) {
  const redis = getRedis()
  const keyOf = (id) => `coll:${name}:${id}`
  const idxKey = `idx:${name}`

  return {
    async get(id) {
      const raw = await redis.get(keyOf(id))
      return raw || null
    },
    async set(id, value) {
      await redis.set(keyOf(id), value)
      await redis.sadd(idxKey, id)
    },
    async remove(id) {
      await redis.del(keyOf(id))
      await redis.srem(idxKey, id)
    },
    async all() {
      const ids = (await redis.smembers(idxKey)) || []
      if (ids.length === 0) return []
      const items = await redis.mget(...ids.map((id) => keyOf(id)))
      return items.filter((x) => x != null)
    },
    async count() {
      const ids = await redis.smembers(idxKey)
      return (ids || []).length
    },
    async clear() {
      const ids = (await redis.smembers(idxKey)) || []
      if (ids.length > 0) {
        await redis.del(...ids.map((id) => keyOf(id)))
      }
      await redis.del(idxKey)
    },
  }
}

// 集合缓存
const cache = new Map()
function collection(name) {
  if (!cache.has(name)) {
    cache.set(name, hasRedis ? createRedisCollection(name) : createMemoryCollection())
  }
  return cache.get(name)
}

// 通用 repository：基于 collection 提供 CRUD + 分页查询
function createRepository(name) {
  const col = collection(name)

  return {
    name,
    async findById(id) {
      if (!id) return null
      return col.get(String(id))
    },
    async find(filter = {}) {
      const all = await col.all()
      return all.filter((item) => matches(item, filter))
    },
    async findOne(filter = {}) {
      const list = await this.find(filter)
      return list[0] || null
    },
    async insert(record) {
      const now = new Date().toISOString()
      const doc = { ...record, createdAt: record.createdAt || now, updatedAt: now }
      await col.set(doc.id, doc)
      return doc
    },
    async update(id, patch) {
      const current = await col.get(String(id))
      if (!current) return null
      const updated = { ...current, ...patch, id: current.id, updatedAt: new Date().toISOString() }
      await col.set(id, updated)
      return updated
    },
    async remove(id) {
      await col.remove(String(id))
    },
    async count(filter = {}) {
      const list = await this.find(filter)
      return list.length
    },
    // 分页查询：返回 { list, total }
    async paginate(filter = {}, options = {}) {
      const { page = 1, pageSize = 20, sortBy, sortOrder = 'desc' } = options
      let list = await this.find(filter)
      if (sortBy) {
        list.sort((a, b) => {
          const av = a[sortBy]
          const bv = b[sortBy]
          if (av == null) return 1
          if (bv == null) return -1
          if (typeof av === 'string' && typeof bv === 'string') {
            return av < bv ? -1 : av > bv ? 1 : 0
          }
          return av - bv
        })
        if (sortOrder === 'desc') list.reverse()
      }
      const total = list.length
      const start = (page - 1) * pageSize
      const paged = list.slice(start, start + pageSize)
      return { list: paged, total, page, pageSize }
    },
    // 低层访问（seed 等场景使用）
    _collection: col,
  }
}

// 简单的过滤匹配器：支持值相等、函数、正则（字符串按 includes 模糊匹配）
function matches(item, filter) {
  if (!item) return false
  for (const key of Object.keys(filter)) {
    const cond = filter[key]
    const val = item[key]
    if (typeof cond === 'function') {
      if (!cond(val, item)) return false
    } else if (cond instanceof RegExp) {
      if (typeof val !== 'string' || !cond.test(val)) return false
    } else if (cond === undefined || cond === null || cond === '') {
      // 空/未定义条件视为不过滤
      continue
    } else {
      if (val !== cond) return false
    }
  }
  return true
}

module.exports = {
  hasRedis,
  collection,
  createRepository,
  // 便捷导出：重置内存（仅内存模式，用于 seed 幂等）
  async clearAll() {
    for (const c of cache.values()) {
      await c.clear()
    }
  },
}
