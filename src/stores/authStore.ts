import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Enterprise } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  enterprise: Enterprise | null
  isAuthenticated: boolean
  
  // Actions
  setAuth: (user: User, token: string, enterprise: Enterprise) => void
  setUser: (user: User) => void
  setEnterprise: (enterprise: Enterprise) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      enterprise: null,
      isAuthenticated: false,

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
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
)
