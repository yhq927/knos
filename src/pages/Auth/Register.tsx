import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Select, message } from 'antd'
import { MailOutlined, LockOutlined, BankOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

// 行业选项
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

// 企业规模选项
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

  const onFinish = async (values: {
    email: string
    password: string
    companyName: string
    industry: string
    size?: string
  }) => {
    setLoading(true)
    try {
      const response = await authApi.register(values)
      const { user, token, enterprise } = response.data
      
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
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #f5f5f4 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#0F766E', marginBottom: 8 }}>
            KnosAI
          </Title>
          <Text type="secondary">创建您的企业知识库</Text>
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
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
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
              prefix={<LockOutlined />}
              placeholder="请输入密码（至少8位，含大小写+数字）"
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
              prefix={<LockOutlined />}
              placeholder="请确认密码"
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
              prefix={<BankOutlined />}
              placeholder="请输入公司名称"
            />
          </Form.Item>

          <Form.Item
            name="industry"
            rules={[{ required: true, message: '请选择所属行业' }]}
          >
            <Select
              placeholder="请选择所属行业"
              options={industryOptions}
            />
          </Form.Item>

          <Form.Item
            name="size"
          >
            <Select
              placeholder="请选择企业规模（可选）"
              options={sizeOptions}
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              已有账号？{' '}
              <Link to="/login" style={{ fontWeight: 600 }}>
                立即登录
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
