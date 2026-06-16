import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { motion } from 'framer-motion'
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
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'var(--bg-page)', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated orb */}
      <motion.div
        style={{
          position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 24, padding: '48px 40px',
          boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(229, 231, 235, 0.3)',
          position: 'relative', zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <motion.div
            style={{
              width: 60, height: 60, borderRadius: 18,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #818cf8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: '#fff',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            }}
            animate={{
              boxShadow: ['0 8px 24px rgba(37,99,235,0.2)', '0 8px 32px rgba(37,99,235,0.4)', '0 8px 24px rgba(37,99,235,0.2)'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >K</motion.div>
          <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 8, fontWeight: 700 }}>
            找回密码
          </Title>
          <Text style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {sent ? '重置链接已发送' : '输入您的注册邮箱，我们将发送重置链接'}
          </Text>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <CheckCircleOutlined style={{ fontSize: 56, color: 'var(--success)', marginBottom: 20 }} />
            </motion.div>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 16, display: 'block', marginBottom: 32 }}>
              若该邮箱已注册，重置链接已发送至您的邮箱，请查收。
            </Text>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="primary" block style={{
                  height: 52, fontSize: 16, fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none', borderRadius: 12,
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                }}>返回登录</Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Form name="forgot" onFinish={onFinish} layout="vertical" size="large">
              <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}>
                <Input
                  prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="请输入注册邮箱"
                  style={{ height: 52 }}
                />
              </Form.Item>
              <Form.Item>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{
                    height: 52, fontSize: 16, fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none', borderRadius: 12,
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                  }}>发送重置链接</Button>
                </motion.div>
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  <ArrowLeftOutlined /> 返回登录
                </Link>
              </div>
            </Form>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ForgotPassword
