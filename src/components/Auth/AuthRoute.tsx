import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'

interface AuthRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'editor' | 'viewer'
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, token, _hydrated, setAuth, logout } = useAuthStore()
  const location = useLocation()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!_hydrated) return

    // 若有 token 但 user 缺失（例如旧的 partialize），尝试恢复
    if (token && !user) {
      authApi
        .me()
        .then((res) => {
          const result = res.data
          if (result.code === 0 && result.data.user) {
            setAuth(result.data.user, token, result.data.enterprise)
          } else {
            logout()
          }
        })
        .catch(() => logout())
        .finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [_hydrated, token, user])

  // 等待 zustand hydration 完成
  if (!_hydrated || checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  // 未认证 → 登录页
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 角色权限检查
  if (requiredRole) {
    const roleHierarchy: Record<string, number> = { admin: 3, editor: 2, viewer: 1 }
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

export default AuthRoute
