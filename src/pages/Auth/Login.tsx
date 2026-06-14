import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const response = await authApi.login(values)
      const result = response.data
      if (result.code === 0) {
        const { user, token, enterprise } = result.data
        setAuth(user, token, enterprise)
        message.success('登录成功')
        navigate('/dashboard')
      } else {
        message.error(result.message || '登录失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败')
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
      background: '#0a0a0a',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: '48px 40px',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 800,
            color: '#fff',
            margin: '0 auto 20px'
          }}>
            K
          </div>
          <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
            登录账号
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
            登录以继续使用 KnosAI
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
              placeholder="请输入邮箱"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                height: 52,
                color: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
              placeholder="请输入密码"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                height: 52
              }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ color: '#667eea', fontSize: 14 }}>
                忘记密码？
              </Link>
            </div>
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 12
              }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
              没有账号？{' '}
              <Link to="/register" style={{ color: '#667eea', fontWeight: 600 }}>
                立即注册
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
