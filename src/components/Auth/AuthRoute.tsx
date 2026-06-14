import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/stores/authStore'

interface AuthRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'editor' | 'viewer'
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // 如果未认证，重定向到登录页
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 如果需要特定角色权限
  if (requiredRole) {
    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 }
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0

    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

export default AuthRoute
