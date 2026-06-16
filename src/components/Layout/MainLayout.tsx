import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space, Input } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DashboardOutlined,
  BookOutlined,
  MessageOutlined,
  FormOutlined,
  UploadOutlined,
  SettingOutlined,
  BarChartOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'
import PageTransition from '@/components/Motion/PageTransition'

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, enterprise, logout } = useAuthStore()

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
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: async () => {
        try { await authApi.logout() } catch {}
        logout()
        navigate('/login')
      },
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={72}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(229, 231, 235, 0.6)',
          zIndex: 101,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo */}
        <motion.div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 20px',
            borderBottom: '1px solid rgba(229, 231, 235, 0.4)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
              animate={{
                boxShadow: [
                  '0 4px 12px rgba(37, 99, 235, 0.2)',
                  '0 4px 20px rgba(37, 99, 235, 0.4)',
                  '0 4px 12px rgba(37, 99, 235, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              K
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}
                >
                  KnosAI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Nav Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: 'transparent',
            marginTop: 12,
            padding: '0 8px',
          }}
        />

        {/* Bottom User Info */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px',
                borderTop: '1px solid rgba(229, 231, 235, 0.4)',
              }}
            >
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
                whileHover={{ backgroundColor: 'rgba(37, 99, 235, 0.04)' }}
                transition={{ duration: 0.15 }}
              >
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || '用户'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || ''}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Sider>

      {/* Main Area */}
      <Layout style={{ marginLeft: collapsed ? 72 : 240, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', background: 'var(--bg-page)' }}>
        {/* Header */}
        <Header
          style={{
            padding: '0 24px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: 64,
            lineHeight: '64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={
                collapsed
                  ? <MenuUnfoldOutlined style={{ color: 'var(--text-muted)', fontSize: 16 }} />
                  : <MenuFoldOutlined style={{ color: 'var(--text-muted)', fontSize: 16 }} />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: 40, height: 40 }}
            />
            <motion.div
              animate={{ width: searchFocused ? 360 : 280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Input
                prefix={<SearchOutlined style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} />}
                placeholder="搜索知识、对话..."
                allowClear
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%',
                  background: searchFocused ? '#fff' : 'var(--surface)',
                  border: searchFocused ? '1px solid var(--primary)' : '1px solid transparent',
                  borderRadius: 10,
                  height: 38,
                  boxShadow: searchFocused ? '0 0 0 3px rgba(37, 99, 235, 0.08)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </motion.div>
          </div>

          <Space size="middle">
            <Badge count={5} size="small">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="text"
                  icon={<BellOutlined style={{ color: 'var(--text-muted)', fontSize: 18 }} />}
                  style={{ width: 40, height: 40, borderRadius: 10 }}
                />
              </motion.div>
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <motion.div
                whileHover={{ backgroundColor: 'rgba(37, 99, 235, 0.04)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 10,
                  transition: 'all 0.15s',
                }}
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)' }}
                />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{user?.name || user?.email}</span>
              </motion.div>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
          }}
        >
          <PageTransition pageKey={location.pathname}>
            {children}
          </PageTransition>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
