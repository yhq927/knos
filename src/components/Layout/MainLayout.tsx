import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space, Input } from 'antd'
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

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, enterprise, logout } = useAuthStore()

  // 侧边栏菜单项
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '控制台',
    },
    {
      key: '/knowledge',
      icon: <BookOutlined />,
      label: '知识库',
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: 'AI问答',
    },
    {
      key: '/collect',
      icon: <FormOutlined />,
      label: '知识采集',
    },
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: '文档上传',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ]

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
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

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        collapsedWidth={72}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          zIndex: 101,
        }}
      >
        {/* Logo 区 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 16px',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              K
            </div>
            {!collapsed && (
              <span style={{ fontSize: 18, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                KnosAI
              </span>
            )}
          </div>
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: 'transparent',
            marginTop: 8,
            padding: '0 8px',
          }}
        />

        {/* 底部用户信息 */}
        {!collapsed && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: '1px solid #F3F4F6',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <Avatar
                size={36}
                icon={<UserOutlined />}
                src={user?.avatar}
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || '用户'}
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 72 : 220, transition: 'all 0.2s', background: '#F8FAFC' }}>
        {/* 顶部栏 */}
        <Header
          style={{
            padding: '0 24px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: 64,
            lineHeight: '64px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined style={{ color: '#6B7280', fontSize: 16 }} /> : <MenuFoldOutlined style={{ color: '#6B7280', fontSize: 16 }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: 40, height: 40 }}
            />
            <Input
              prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="搜索..."
              allowClear
              style={{
                width: 280,
                background: '#F3F4F6',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                height: 38,
              }}
            />
          </div>

          <Space size="middle">
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ color: '#6B7280', fontSize: 18 }} />}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 10, transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F3F4F6')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' }}
                />
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{user?.name || user?.email}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
            background: '#F8FAFC',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
