import { describe, it, expect } from 'vitest'

describe('Auth Store', () => {
  it('should export useAuthStore', async () => {
    const mod = await import('@/stores/authStore')
    expect(mod.useAuthStore).toBeDefined()
    expect(typeof mod.useAuthStore).toBe('function')
  })

  it('should have initial state', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBeDefined()
    expect(typeof state.setAuth).toBe('function')
    expect(typeof state.logout).toBe('function')
  })
})

describe('API Service', () => {
  it('should export authApi', async () => {
    const mod = await import('@/services/api')
    expect(mod.authApi).toBeDefined()
    expect(typeof mod.authApi.login).toBe('function')
    expect(typeof mod.authApi.register).toBe('function')
    expect(typeof mod.authApi.me).toBe('function')
    expect(typeof mod.authApi.logout).toBe('function')
  })

  it('should export knowledgeApi', async () => {
    const mod = await import('@/services/api')
    expect(mod.knowledgeApi).toBeDefined()
    expect(typeof mod.knowledgeApi.getList).toBe('function')
    expect(typeof mod.knowledgeApi.create).toBe('function')
    expect(typeof mod.knowledgeApi.update).toBe('function')
    expect(typeof mod.knowledgeApi.delete).toBe('function')
  })

  it('should export chatApi', async () => {
    const mod = await import('@/services/api')
    expect(mod.chatApi).toBeDefined()
    expect(typeof mod.chatApi.sendMessage).toBe('function')
  })

  it('should export all API modules', async () => {
    const mod = await import('@/services/api')
    expect(mod.enterpriseApi).toBeDefined()
    expect(mod.membersApi).toBeDefined()
    expect(mod.businessUnitsApi).toBeDefined()
    expect(mod.uploadApi).toBeDefined()
    expect(mod.analyticsApi).toBeDefined()
    expect(mod.billingApi).toBeDefined()
    expect(mod.collectApi).toBeDefined()
    expect(mod.notificationsApi).toBeDefined()
    expect(mod.publicApi).toBeDefined()
  })
})

describe('Types', () => {
  it('should export type interfaces (compile-time check)', async () => {
    const mod = await import('@/types')
    // Types don't exist at runtime, but the module should load
    expect(mod).toBeDefined()
  })
})
