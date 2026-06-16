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
      flexDirection: 'column',
      background: '#F8FAFC',
      padding: '20px',
      position: 'relative',
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 顶部导航 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1,
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: '#fff'
          }}>K</div>
          <span style={{ color: '#111827', fontSize: 16, fontWeight: 600 }}>KnosAI</span>
        </Link>
      </div>

      {/* 登录表单 */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 20,
          padding: '48px 40px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              margin: '0 auto 20px',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
            }}>
              K
            </div>
            <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
              登录账号
            </Title>
            <Text style={{ color: '#6B7280' }}>
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
              prefix={<MailOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="请输入邮箱"
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
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
              placeholder="请输入密码"
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                height: 52,
                color: '#111827',
              }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ color: '#2563EB', fontSize: 14 }}>
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
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#6B7280' }}>
              没有账号？{' '}
              <Link to="/register" style={{ color: '#2563EB', fontWeight: 600 }}>
                立即注册
              </Link>
            </Text>
          </div>
        </Form>
      </div>
      </div>
    </div>
  )
}

export default Login
