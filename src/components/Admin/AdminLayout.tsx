import React from 'react'
import { Layout, Menu, Typography, Button, Space, Avatar } from 'antd'
import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const { Sider, Content } = Layout
const { Text } = Typography

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/admin/enterprises',
      icon: <ShopOutlined />,
      label: '企业管理',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}')
    } catch {
      return {}
    }
  })()

  return (
    <Layout style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Sider
        width={240}
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid #F3F4F6',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SafetyOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div>
            <div style={{ color: '#111827', fontSize: 16, fontWeight: 700 }}>KnosAI</div>
            <div style={{ color: '#9CA3AF', fontSize: 12 }}>管理后台</div>
          </div>
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '12px 8px',
            flex: 1,
          }}
        />

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #F3F4F6',
        }}>
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', flexShrink: 0 }}
            />
            <div>
              <Text style={{ color: '#9CA3AF', fontSize: 11, display: 'block' }}>管理员</Text>
              <Text style={{ color: '#111827', fontSize: 14, fontWeight: 600, display: 'block' }}>
                {adminUser.username || 'admin'}
              </Text>
            </div>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            size="small"
            style={{ borderRadius: 8 }}
          >
            退出登录
          </Button>
        </div>
      </Sider>

      <Content style={{ padding: '32px', overflow: 'auto', background: '#F8FAFC' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default AdminLayout
