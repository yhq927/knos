import React from 'react'
import { Layout, Menu, Typography, Button, Space, Avatar } from 'antd'
import { motion } from 'framer-motion'
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
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/admin/enterprises', icon: <ShopOutlined />, label: '企业管理' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: '系统设置' },
  ]

  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}')
    } catch {
      return {}
    }
  })()

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sider
        width={240}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(229, 231, 235, 0.6)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <motion.div
          style={{
            padding: '24px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(229, 231, 235, 0.4)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            <SafetyOutlined style={{ fontSize: 20, color: '#fff' }} />
          </motion.div>
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>KnosAI</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>管理后台</div>
          </div>
        </motion.div>

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
        <motion.div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(229, 231, 235, 0.4)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)', flexShrink: 0, boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)' }}
            />
            <div>
              <Text style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block' }}>管理员</Text>
              <Text style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, display: 'block' }}>
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
        </motion.div>
      </Sider>

      <Content style={{ padding: '32px', overflow: 'auto', background: 'var(--bg-page)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </Content>
    </Layout>
  )
}

export default AdminLayout
