import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { authApi } from '@/services/api'

const { Title, Text } = Typography

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onFinish = async (values: { email: string }) => {
    setLoading(true)
    try {
      await authApi.forgotPassword(values.email)
      setSent(true)
    } catch {
      // 不暴露邮箱是否存在
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0a0a0a',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: '48px 40px',
          backdropFilter: 'blur(20px)',
        }}
      >
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
          <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
            找回密码
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
            {sent ? '重置链接已发送' : '输入您的注册邮箱，我们将发送重置链接'}
          </Text>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#43e97b', marginBottom: 20 }} />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, display: 'block', marginBottom: 32 }}>
              若该邮箱已注册，重置链接已发送至您的邮箱，请查收。
            </Text>
            <Link to="/login">
              <Button
                type="primary"
                block
                style={{
                  height: 52,
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: 12,
                }}
              >
                返回登录
              </Button>
            </Link>
          </div>
        ) : (
          <Form name="forgot" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                placeholder="请输入注册邮箱"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  height: 52,
                  color: '#fff',
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: 12,
                }}
              >
                发送重置链接
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#667eea' }}>
                <ArrowLeftOutlined /> 返回登录
              </Link>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
