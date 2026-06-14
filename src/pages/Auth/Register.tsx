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
      const { user, token, enterprise } = response.data.data || response.data
      setAuth(user, token, enterprise)
      message.success('注册成功')
      navigate('/dashboard')
    } catch (error: any) {
      message.error(error.response?.data?.message || '注册失败')
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
          left: '-30%',
          width: '80%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 60%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50%',
          right: '-30%',
          width: '80%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* 左侧注册表单 */}
      <div
        style={{
          flex: 1,
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
            maxWidth: 480,
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
              创建账号
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                placeholder="请输入邮箱"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  height: 52,
                }}
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
                prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                placeholder="请输入密码（至少8位）"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  height: 52,
                }}
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
                prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                placeholder="请确认密码"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  height: 52,
                }}
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
                prefix={<BankOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                placeholder="请输入公司名称"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  height: 52,
                }}
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
                dropdownStyle={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </Form.Item>

            <Form.Item name="size">
              <Select
                placeholder="请选择企业规模（可选）"
                options={sizeOptions}
                allowClear
                style={{ height: 52 }}
                dropdownStyle={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
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
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                }}
              >
                注册
                <ArrowRightOutlined />
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
                已有账号？{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    fontWeight: 600,
                  }}
                >
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
              ✨ 为什么选择 KnosAI
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
            让知识管理
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              更加智能
            </span>
          </Title>

          <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1.8 }}>
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
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#667eea',
                    flexShrink: 0,
                  }}
                >
                  {item.num}
                </div>
                <div>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 600, display: 'block' }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                    {item.desc}
                  </Text>
                </div>
              </div>
            ))}
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
        
        .ant-input,
        .ant-input-password,
        .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #fff !important;
        }
        
        .ant-input::placeholder,
        .ant-select-selection-placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
        
        .ant-input:focus,
        .ant-input-password:focus,
        .ant-select-focused .ant-select-selector {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
        }
        
        .ant-select-arrow {
          color: rgba(255,255,255,0.3) !important;
        }
        
        .ant-select-dropdown {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .ant-select-item {
          color: rgba(255,255,255,0.8) !important;
        }
        
        .ant-select-item-option-active {
          background: rgba(102, 126, 234, 0.2) !important;
        }
        
        .ant-select-item-option-selected {
          background: rgba(102, 126, 234, 0.3) !important;
        }
      `}</style>
    </div>
  )
}

export default Register
