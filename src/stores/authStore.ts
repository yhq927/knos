import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, Enterprise } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  enterprise: Enterprise | null
  isAuthenticated: boolean
  _hydrated: boolean

  // Actions
  setAuth: (user: User, token: string, enterprise: Enterprise) => void
  setUser: (user: User) => void
  setEnterprise: (enterprise: Enterprise) => void
  setToken: (token: string) => void
  setHydrated: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      enterprise: null,
      isAuthenticated: false,
      _hydrated: false,

      setAuth: (user, token, enterprise) => {
        set({
          user,
          token,
          enterprise,
          isAuthenticated: true,
        })
      },

      setUser: (user) => {
        set({ user })
      },

      setEnterprise: (enterprise) => {
        set({ enterprise })
      },

      setToken: (token) => {
        set({ token })
      },

      setHydrated: (v) => {
        set({ _hydrated: v })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          enterprise: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'knosai-auth',
      storage: createJSONStorage(() => localStorage),
      // 持久化 token + user + enterprise，刷新后保持登录态
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        enterprise: state.enterprise,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // 标记 hydration 完成，让 AuthRoute 可以判断
        state?.setHydrated(true)
      },
    }
  )
)
