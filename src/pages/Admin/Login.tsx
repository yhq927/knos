import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { motion } from 'framer-motion'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'

const { Title, Text } = Typography

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response = await api.post('/admin/login', values)
      const result = response.data
      if (result.code === 0) {
        localStorage.setItem('admin_token', result.data.token)
        localStorage.setItem('admin_user', JSON.stringify(result.data.user))
        message.success('登录成功')
        navigate('/admin/dashboard')
      } else message.error(result.message || '登录失败')
    } catch (error: any) { message.error(error.response?.data?.message || '登录失败') }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      <motion.div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}
        animate={{ x: [0, -20, 20, 0], y: [0, 20, -20, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <div style={{
          width: '100%', maxWidth: 420, padding: '48px 40px', borderRadius: 28,
          background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 40 }}>
            <motion.div style={{
              width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              boxShadow: '0 12px 32px rgba(102,126,234,0.4)',
            }} animate={{ boxShadow: ['0 12px 32px rgba(102,126,234,0.3)', '0 12px 40px rgba(102,126,234,0.5)', '0 12px 32px rgba(102,126,234,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <SafetyOutlined style={{ color: '#fff' }} />
            </motion.div>
            <Title level={3} style={{ color: '#f1f5f9', marginBottom: 8, fontWeight: 700 }}>管理后台</Title>
            <Text style={{ color: '#94a3b8', fontSize: 15 }}>请登录管理员账号</Text>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Form name="admin_login" onFinish={onFinish} autoComplete="off" layout="vertical" size="large">
              <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input prefix={<UserOutlined style={{ color: '#64748b' }} />} placeholder="请输入用户名"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, height: 52, color: '#f1f5f9' }} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#64748b' }} />} placeholder="请输入密码"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, height: 52, color: '#f1f5f9' }} />
              </Form.Item>
              <Form.Item>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="primary" htmlType="submit" loading={loading} block
                    style={{ height: 52, fontSize: 16, fontWeight: 600, borderRadius: 14,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none',
                      boxShadow: '0 8px 24px rgba(102,126,234,0.4)' }}>登录</Button>
                </motion.div>
              </Form.Item>
            </Form>
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Text style={{ color: '#64748b', fontSize: 12 }}>测试账号: admin / admin123</Text>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
