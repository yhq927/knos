import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space, Input } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DashboardOutlined, BookOutlined, MessageOutlined, FormOutlined,
  UploadOutlined, SettingOutlined, BarChartOutlined, BellOutlined,
  UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'
import PageTransition from '@/components/Motion/PageTransition'

const { Content } = Layout

/* ── Styles ── */
const sidebarStyle: React.CSSProperties = {
  position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 101,
  background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
  borderRight: 'none',
  overflow: 'auto',
  display: 'flex', flexDirection: 'column',
}

const headerStyle: React.CSSProperties = {
  padding: '0 28px',
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
  borderBottom: '1px solid rgba(148,163,184,0.15)',
  position: 'sticky', top: 0, zIndex: 100,
  height: 64, lineHeight: '64px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
}

const menuItemStyle: React.CSSProperties = {
  marginBottom: 2,
  borderRadius: 10,
  height: 44,
  display: 'flex', alignItems: 'center',
}

interface MainLayoutProps { children: React.ReactNode }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '控制台' },
    { key: '/knowledge', icon: <BookOutlined />, label: '知识库' },
    { key: '/chat', icon: <MessageOutlined />, label: 'AI问答' },
    { key: '/collect', icon: <FormOutlined />, label: '知识采集' },
    { key: '/upload', icon: <UploadOutlined />, label: '文档上传' },
    { key: '/analytics', icon: <BarChartOutlined />, label: '数据分析' },
    { key: '/settings', icon: <SettingOutlined />, label: '设置' },
  ]

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置', onClick: () => navigate('/settings') },
    { type: 'divider' as const },
    {
      key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true,
      onClick: async () => { try { await authApi.logout() } catch {}; logout(); navigate('/login') },
    },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 30%, #f5f0ff 60%, #f0f4ff 100%)' }}>
      {/* ── Decorative orbs ── */}
      <div style={{ position: 'fixed', top: '-15%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 250 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ ...sidebarStyle, width: collapsed ? 72 : 250 }}
      >
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.div
            style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}
            animate={{ boxShadow: ['0 4px 16px rgba(99,102,241,0.3)', '0 4px 24px rgba(99,102,241,0.5)', '0 4px 16px rgba(99,102,241,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >K</motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                style={{ fontSize: 19, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}
              >KnosAI</motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, padding: '16px 10px', overflow: 'auto' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.key
            return (
              <motion.div
                key={item.key}
                onClick={() => navigate(item.key)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  ...menuItemStyle,
                  padding: collapsed ? '0 0 0 0' : '0 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 10,
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(129,140,248,0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span style={{ fontSize: 18, color: isActive ? '#a5b4fc' : '#94a3b8', position: 'relative', zIndex: 1 }}>{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                      style={{ marginLeft: 12, fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? '#e2e8f0' : '#94a3b8', whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}
                    >{item.label}</motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* User */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer' }}
              >
                <Avatar size={36} icon={<UserOutlined />} src={user?.avatar}
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || '用户'}</div>
                  <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: collapsed ? 72 : 250, transition: 'margin-left 0.3s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined style={{ color: '#64748b', fontSize: 16 }} /> : <MenuFoldOutlined style={{ color: '#64748b', fontSize: 16 }} />}
              onClick={() => setCollapsed(!collapsed)} style={{ width: 40, height: 40 }}
            />
            <motion.div animate={{ width: searchFocused ? 380 : 280 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <Input
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                placeholder="搜索知识、对话..."
                allowClear
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 12,
                  background: searchFocused ? 'rgba(255,255,255,0.9)' : 'rgba(241,245,249,0.8)',
                }}
              />
            </motion.div>
          </div>
          <Space size={12}>
            <Badge count={3} size="small">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="text" icon={<BellOutlined style={{ color: '#64748b', fontSize: 18 }} />} style={{ width: 40, height: 40, borderRadius: 10 }} />
              </motion.div>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <motion.div whileHover={{ backgroundColor: 'rgba(99,102,241,0.06)' }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }}
              >
                <Avatar size="small" icon={<UserOutlined />} src={user?.avatar}
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
                />
                <span style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>{user?.name || user?.email}</span>
              </motion.div>
            </Dropdown>
          </Space>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 28, position: 'relative' }}>
          <PageTransition pageKey={location.pathname}>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
