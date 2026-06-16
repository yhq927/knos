import React, { useState } from 'react'
import { Form, Input, Button, Select, Typography, message } from 'antd'
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
      background: '#F8FAFC',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 左侧注册表单 */}
      <div style={{
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* 顶部导航 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 0',
          marginBottom: '20px'
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

        {/* 表单容器 */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 480,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 20,
            padding: '48px 40px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
          }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
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
              }}
            >
              K
            </div>
            <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
              创建账号
            </Title>
            <Text style={{ color: '#6B7280' }}>
              开始构建您的智能知识库
            </Text>
          </div>

          <Form
            name="register"
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
                prefix={<MailOutlined style={{ color: '#9CA3AF' }} />}
                placeholder="请输入邮箱"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, height: 52, color: '#111827' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少8位' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9CA3AF' }} />}
                placeholder="请输入密码（至少8位）"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, height: 52, color: '#111827' }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9CA3AF' }} />}
                placeholder="请确认密码"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, height: 52, color: '#111827' }}
              />
            </Form.Item>

            <Form.Item
              name="companyName"
              rules={[
                { required: true, message: '请输入公司名称' },
                { min: 2, max: 200, message: '公司名称2-200个字符' },
              ]}
            >
              <Input
                prefix={<BankOutlined style={{ color: '#9CA3AF' }} />}
                placeholder="请输入公司名称"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, height: 52, color: '#111827' }}
              />
            </Form.Item>

            <Form.Item
              name="industry"
              rules={[{ required: true, message: '请选择所属行业' }]}
            >
              <Select
                placeholder="请选择所属行业"
                options={industryOptions}
                style={{ height: 52 }}
              />
            </Form.Item>

            <Form.Item name="size">
              <Select
                placeholder="请选择企业规模（可选）"
                options={sizeOptions}
                allowClear
                style={{ height: 52 }}
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
                注册
                <ArrowRightOutlined />
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#6B7280' }}>
                已有账号？{' '}
                <Link to="/login" style={{ color: '#2563EB', fontWeight: 600 }}>
                  立即登录
                </Link>
              </Text>
            </div>
          </Form>
        </div>
      </div>

      {/* 右侧装饰 */}
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
        className="register-right"
      >
        <div style={{ maxWidth: 500 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            borderRadius: 100,
            background: '#E0E7FF',
            border: '1px solid #C7D2FE',
            marginBottom: 32,
          }}>
            <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600 }}>
              ✨ 为什么选择 KnosAI
            </Text>
          </div>

          <Title
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#111827',
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            让知识管理
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              更加智能
            </span>
          </Title>

          <Paragraph style={{ color: '#6B7280', fontSize: 18, lineHeight: 1.8 }}>
            AI驱动的智能知识管理平台，帮助企业沉淀经验、提升效率。
          </Paragraph>

          <div style={{ marginTop: 48 }}>
            {[
              { num: '01', title: '智能采集', desc: 'AI引导式问答，10分钟完成知识沉淀' },
              { num: '02', title: '精准问答', desc: '基于企业知识库的AI问答，附带来源标注' },
              { num: '03', title: '数据私有', desc: '支持自定义API Key，数据完全私有' },
              { num: '04', title: '对外服务', desc: '将知识库转化为客户服务工具' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: 16,
                  marginBottom: 24,
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#2563EB',
                    flexShrink: 0,
                  }}
                >
                  {item.num}
                </div>
                <div>
                  <Text style={{ color: '#111827', fontSize: 16, fontWeight: 600, display: 'block' }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 14 }}>
                    {item.desc}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* 响应式样式 */}
      <style>{`
        @media (max-width: 1024px) {
          .register-right {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Register
