import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons'
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
      const { user, token, enterprise } = response.data
      setAuth(user, token, enterprise)
      message.success('登录成功')
      navigate('/dashboard')
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '80%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 60%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-30%',
          width: '80%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* 左侧装饰 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          zIndex: 1,
        }}
        className="login-left"
      >
        <div style={{ maxWidth: 500 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: 100,
              background: 'rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              marginBottom: 32,
            }}
          >
            <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600 }}>
              ✨ 企业智能知识管理平台
            </Text>
          </div>

          <Title
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            欢迎回来
          </Title>

          <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1.8 }}>
            登录您的账号，继续管理企业知识库。AI驱动的智能问答，让知识触手可及。
          </Paragraph>

          <div style={{ marginTop: 48 }}>
            {['AI驱动的智能知识管理', '企业数据完全私有', '多端适配随时随地'].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#fff',
                  }}
                >
                  ✓
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>{item}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div
        style={{
          width: 520,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: '48px 40px',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div
              style={{
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
                margin: '0 auto 20px',
              }}
            >
              K
            </div>
            <Title level={3} style={{ color: '#fff', marginBottom: 8, fontWeight: 700 }}>
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
                { type: 'email', message: '请输入有效的邮箱地址' },
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
                  color: '#fff',
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
                  height: 52,
                }}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to="/forgot-password"
                  style={{ color: '#667eea', fontSize: 14 }}
                >
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
                  borderRadius: 12,
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                }}
              >
                登录
                <ArrowRightOutlined />
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
                没有账号？{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#667eea',
                    fontWeight: 600,
                  }}
                >
                  立即注册
                </Link>
              </Text>
            </div>
          </Form>
        </div>
      </div>

      {/* 响应式样式 */}
      <style>{`
        @media (max-width: 1024px) {
          .login-left {
            display: none !important;
          }
        }
        
        .ant-input,
        .ant-input-password {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #fff !important;
        }
        
        .ant-input::placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
        
        .ant-input:focus,
        .ant-input-password:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
        }
        
        .ant-input-prefix {
          margin-right: 12px;
        }
      `}</style>
    </div>
  )
}

export default Login
