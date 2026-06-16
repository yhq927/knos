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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#F8FAFC',
      padding: 20,
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
          <Title level={3} style={{ color: '#111827', marginBottom: 8 }}>
            找回密码
          </Title>
          <Text style={{ color: '#6B7280' }}>
            {sent ? '重置链接已发送' : '输入您的注册邮箱，我们将发送重置链接'}
          </Text>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#10B981', marginBottom: 20 }} />
            <Text style={{ color: '#374151', fontSize: 16, display: 'block', marginBottom: 32 }}>
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
                  background: '#2563EB',
                  border: 'none',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
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
                prefix={<MailOutlined style={{ color: '#9CA3AF' }} />}
                placeholder="请输入注册邮箱"
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
                发送重置链接
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#2563EB' }}>
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
