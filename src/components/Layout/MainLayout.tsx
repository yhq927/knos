import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space } from 'antd'
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
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

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
      onClick: () => {
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
    <Layout style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#111',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              K
            </div>
            {!collapsed && (
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                KnosAI
              </span>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: 'transparent',
            marginTop: 8,
          }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s', background: '#0a0a0a' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ color: 'rgba(255,255,255,0.7)' }} /> : <MenuFoldOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space size="middle">
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{user?.name || user?.email}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px',
            minHeight: 280,
            background: '#0a0a0a',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
