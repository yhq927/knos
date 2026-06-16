import React, { useState } from 'react'
import { Form, Input, Button, Typography, message, Card } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      const result = await response.json()

      if (result.code === 0) {
        localStorage.setItem('admin_token', result.data.token)
        localStorage.setItem('admin_user', JSON.stringify(result.data.user))
        message.success('登录成功')
        navigate('/admin/dashboard')
      } else {
        message.error(result.message || '登录失败')
      }
    } catch (error) {
      message.error('登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Card style={{
        width: '100%',
        maxWidth: 420,
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 24,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
          }}>
            <SafetyOutlined style={{ fontSize: 32, color: '#fff' }} />
          </div>
          <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
            平台管理后台
          </Title>
          <Text style={{ color: '#6B7280' }}>
            KnosAI 管理员登录
          </Text>
        </div>

        <Form
          name="admin_login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入管理员账号' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="管理员账号"
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                height: 52,
                color: '#111827',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="密码"
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                height: 52,
                color: '#111827',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 52,
                fontSize: 16,
                fontWeight: 600,
                background: '#2563EB',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
            测试账号: admin / admin123
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default AdminLogin
