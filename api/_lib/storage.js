// 统一存储抽象层
// - 内存实现 (MemoryStore)：零配置，开发/测试默认
// - KV 实现 (KVStore)：基于 @vercel/kv，配置 KV_REST_API_URL + KV_REST_API_TOKEN 时自动启用
// 通过 getStore() 按 collection 名称返回 repository，所有方法均为 async

const hasKV =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN

let kvClient = null
function getKV() {
  if (!kvClient) {
    // 动态加载，避免未配置 KV 时 import 报错
    kvClient = require('@vercel/kv')
  }
  return kvClient
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
// KV 实现：用 hset/hgetall 维护 collection，单条用 hset field
// ----------------------------------------------------------------------------
function createKVCollection(name) {
  const kv = getKV()
  const keyOf = (id) => `coll:${name}:${id}`
  const idxKey = `idx:${name}` // 记录所有 id 的集合(set)

  return {
    async get(id) {
      const raw = await kv.get(keyOf(id))
      return raw || null
    },
    async set(id, value) {
      await kv.set(keyOf(id), value)
      await kv.sadd(idxKey, id)
    },
    async remove(id) {
      await kv.del(keyOf(id))
      await kv.srem(idxKey, id)
    },
    async all() {
      const ids = (await kv.smembers(idxKey)) || []
      if (ids.length === 0) return []
      const items = await kv.mget(...ids.map((id) => keyOf(id)))
      return items.filter((x) => x != null)
    },
    async count() {
      const ids = await kv.smembers(idxKey)
      return (ids || []).length
    },
    async clear() {
      const ids = (await kv.smembers(idxKey)) || []
      if (ids.length > 0) {
        await kv.del(...ids.map((id) => keyOf(id)))
      }
      await kv.del(idxKey)
    },
  }
}

// 集合缓存
const cache = new Map()
function collection(name) {
  if (!cache.has(name)) {
    cache.set(name, hasKV ? createKVCollection(name) : createMemoryCollection())
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
  hasKV,
  collection,
  createRepository,
  // 便捷导出：重置内存（仅内存模式，用于 seed 幂等）
  async clearAll() {
    for (const c of cache.values()) {
      await c.clear()
    }
  },
}
