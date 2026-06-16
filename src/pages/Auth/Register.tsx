import React, { useState } from 'react'
import { Form, Input, Button, Select, Typography, message } from 'antd'
import { motion } from 'framer-motion'
import { MailOutlined, LockOutlined, BankOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text, Paragraph } = Typography

const industryOptions = [
  { value: 'technology', label: '科技/互联网' },
  { value: 'finance', label: '金融' },
  { value: 'healthcare', label: '医疗健康' },
  { value: 'education', label: '教育' },
  { value: 'retail', label: '零售' },
  { value: 'manufacturing', label: '制造业' },
  { value: 'consulting', label: '咨询服务' },
  { value: 'other', label: '其他' },
]

const sizeOptions = [
  { value: '1-10', label: '1-10人' },
  { value: '11-50', label: '11-50人' },
  { value: '51-200', label: '51-200人' },
  { value: '201-500', label: '201-500人' },
  { value: '500+', label: '500人以上' },
]

const inputStyle = {
  background: 'rgba(249, 250, 251, 0.8)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  height: 52,
  color: 'var(--text-primary)',
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await authApi.register(values)
      const result = response.data
      if (result.code === 0) {
        const { user, token, enterprise } = result.data
        setAuth(user, token, enterprise)
        message.success('注册成功')
        navigate('/dashboard')
      } else {
        message.error(result.message || '注册失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-page)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      <motion.div
        style={{
          position: 'absolute', top: '-30%', right: '-10%', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', bottom: '-20%', left: '30%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }}
        animate={{ x: [0, -20, 20, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Left: Form */}
      <div style={{
        flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        padding: '20px 40px', position: 'relative', zIndex: 1,
      }}>
        {/* Nav */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', padding: '10px 0', marginBottom: 20 }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #818cf8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}>K</div>
            <span style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>KnosAI</span>
          </Link>
        </motion.div>

        {/* Form Container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%', maxWidth: 480,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: 24, padding: '48px 40px',
              boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(229, 231, 235, 0.3)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ textAlign: 'center', marginBottom: 36 }}
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
              <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 8, fontWeight: 700 }}>创建账号</Title>
              <Text style={{ color: 'var(--text-muted)', fontSize: 15 }}>开始构建您的智能知识库</Text>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <Form name="register" onFinish={onFinish} autoComplete="off" layout="vertical" size="large">
                <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}>
                  <Input prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="请输入邮箱" style={inputStyle} />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少8位' }]}>
                  <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="请输入密码（至少8位）" style={inputStyle} />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve()
                        return Promise.reject(new Error('两次输入的密码不一致'))
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="请确认密码" style={inputStyle} />
                </Form.Item>
                <Form.Item name="companyName" rules={[{ required: true, message: '请输入公司名称' }, { min: 2, max: 200, message: '公司名称2-200个字符' }]}>
                  <Input prefix={<BankOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="请输入公司名称" style={inputStyle} />
                </Form.Item>
                <Form.Item name="industry" rules={[{ required: true, message: '请选择所属行业' }]}>
                  <Select placeholder="请选择所属行业" options={industryOptions} style={{ height: 52 }} />
                </Form.Item>
                <Form.Item name="size">
                  <Select placeholder="请选择企业规模（可选）" options={sizeOptions} allowClear style={{ height: 52 }} />
                </Form.Item>
                <Form.Item>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button type="primary" htmlType="submit" loading={loading} block style={{
                      height: 52, fontSize: 16, fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none', borderRadius: 12,
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    }}>
                      注册 <ArrowRightOutlined />
                    </Button>
                  </motion.div>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: 'var(--text-muted)' }}>
                    已有账号？ <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>立即登录</Link>
                  </Text>
                </div>
              </Form>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right: Decorative */}
      <motion.div
        className="register-right"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px', position: 'relative', zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <div style={{
            display: 'inline-block', padding: '8px 20px', borderRadius: 100,
            background: 'var(--primary-light)', border: '1px solid rgba(196, 181, 253, 0.3)', marginBottom: 32,
          }}>
            <Text style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600 }}>为什么选择 KnosAI</Text>
          </div>

          <Title style={{ fontSize: 48, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.2 }}>
            让知识管理<br />
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>更加智能</span>
          </Title>

          <Paragraph style={{ color: 'var(--text-secondary)', fontSize: 18, lineHeight: 1.8 }}>
            AI驱动的智能知识管理平台，帮助企业沉淀经验、提升效率。
          </Paragraph>

          <div style={{ marginTop: 48 }}>
            {[
              { num: '01', title: '智能采集', desc: 'AI引导式问答，10分钟完成知识沉淀' },
              { num: '02', title: '精准问答', desc: '基于企业知识库的AI问答，附带来源标注' },
              { num: '03', title: '数据私有', desc: '支持自定义API Key，数据完全私有' },
              { num: '04', title: '对外服务', desc: '将知识库转化为客户服务工具' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ x: 4, boxShadow: '0 8px 24px -4px rgba(102, 126, 234, 0.1)' }}
                style={{
                  display: 'flex', gap: 16, marginBottom: 20, padding: '18px 22px', borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 800, color: 'var(--primary)', flexShrink: 0,
                }}>{item.num}</div>
                <div>
                  <Text style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, display: 'block' }}>{item.title}</Text>
                  <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{item.desc}</Text>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 1024px) {
          .register-right { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Register
