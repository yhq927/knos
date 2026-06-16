import React from 'react'
import { Layout, Menu, Typography, Button, Space } from 'antd'
import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  SafetyOutlined,
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
    <Layout style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Sider
        width={240}
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
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
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SafetyOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>KnosAI</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>管理后台</div>
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
          theme="dark"
        />

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>管理员</Text>
            <div style={{ color: '#fff', fontSize: 14, marginTop: 2 }}>
              {adminUser.username || 'admin'}
            </div>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
            block
            size="small"
          >
            退出登录
          </Button>
        </div>
      </Sider>

      <Content style={{ padding: '32px', overflow: 'auto' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default AdminLayout
