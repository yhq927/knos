import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { motion } from 'framer-motion'
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
      background: 'var(--bg-page)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background orbs */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top nav */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #818cf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}>K</div>
          <span style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>KnosAI</span>
        </Link>
      </motion.div>

      {/* Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '0 20px 40px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: 24,
            padding: '48px 40px',
            boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(229, 231, 235, 0.3)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <motion.div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #818cf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 800,
                color: '#fff',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              }}
              animate={{
                boxShadow: [
                  '0 8px 24px rgba(102, 126, 234, 0.2)',
                  '0 8px 32px rgba(102, 126, 234, 0.4)',
                  '0 8px 24px rgba(102, 126, 234, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              K
            </motion.div>
            <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 8, fontWeight: 700 }}>
              欢迎回来
            </Title>
            <Text style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              登录以继续使用 KnosAI
            </Text>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
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
                  prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="请输入邮箱"
                  style={{ height: 52 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="请输入密码"
                  style={{ height: 52 }}
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 500 }}>
                    忘记密码？
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    登录
                  </Button>
                </motion.div>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'var(--text-muted)' }}>
                  没有账号？{' '}
                  <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    立即注册
                  </Link>
                </Text>
              </div>
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
