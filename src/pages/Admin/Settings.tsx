import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, message, Space, Tag, Row, Col } from 'antd'
import { SaveOutlined, ApiOutlined, GlobalOutlined, MailOutlined, InfoCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const AdminSettings: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.code === 0 && data.data) {
        form.setFieldsValue(data.data)
      }
    } catch (error) {
      console.error('获取设置失败:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })
      const data = await res.json()
      if (data.code === 0) {
        message.success('设置已保存')
      } else {
        message.error(data.message)
      }
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }

  const inputStyle = {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 10,
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#111827', marginBottom: 4, fontWeight: 700 }}>系统设置</Title>
        <Text style={{ color: '#6B7280' }}>管理平台全局配置</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          platformName: 'KnosAI',
          contactEmail: 'admin@knosai.com',
          welcomeMessage: '您好，我是您的智能助手',
        }}
      >
        {/* 平台信息 */}
        <Card
          title={
            <Space>
              <GlobalOutlined style={{ color: '#2563EB' }} />
              <span style={{ color: '#111827', fontWeight: 600 }}>平台信息</span>
            </Space>
          }
          style={cardStyle}
          loading={fetching}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="platformName"
                label={<Text style={{ color: '#374151' }}>平台名称</Text>}
                rules={[{ required: true, message: '请输入平台名称' }]}
              >
                <Input prefix={<GlobalOutlined style={{ color: '#9CA3AF' }} />} style={inputStyle} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label={<Text style={{ color: '#374151' }}>联系邮箱</Text>}
                rules={[{ type: 'email', message: '请输入有效邮箱' }]}
              >
                <Input prefix={<MailOutlined style={{ color: '#9CA3AF' }} />} style={inputStyle} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="welcomeMessage"
            label={<Text style={{ color: '#374151' }}>默认欢迎语</Text>}
          >
            <Input.TextArea
              rows={3}
              placeholder="新企业创建后的默认 AI 欢迎消息"
              style={{ ...inputStyle, resize: 'none' }}
            />
          </Form.Item>
        </Card>

        {/* AI 服务配置 */}
        <Card
          title={
            <Space>
              <ApiOutlined style={{ color: '#10B981' }} />
              <span style={{ color: '#111827', fontWeight: 600 }}>AI 服务配置</span>
            </Space>
          }
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="aiProvider"
                label={<Text style={{ color: '#374151' }}>AI 服务商</Text>}
              >
                <Input placeholder="如: openai, azure, custom" style={inputStyle} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="aiModel"
                label={<Text style={{ color: '#374151' }}>默认模型</Text>}
              >
                <Input placeholder="如: gpt-4o-mini" style={inputStyle} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="aiApiKey"
            label={<Text style={{ color: '#374151' }}>平台 API Key</Text>}
          >
            <Input.Password placeholder="平台级别的 AI API Key（可选，企业也可自行配置）" style={inputStyle} />
          </Form.Item>
        </Card>

        {/* 系统信息 */}
        <Card
          title={
            <Space>
              <InfoCircleOutlined style={{ color: '#F59E0B' }} />
              <span style={{ color: '#111827', fontWeight: 600 }}>系统信息</span>
            </Space>
          }
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 48px' }}>
            {[
              { label: '系统版本', value: 'v1.0.0' },
              { label: '运行环境', value: 'Vercel Serverless' },
              { label: '存储引擎', value: 'In-Memory / Upstash Redis' },
              { label: 'Node.js', value: 'v18+' },
            ].map((item) => (
              <div key={item.label}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{item.label}</Text>
                <div style={{ color: '#111827', fontSize: 14, marginTop: 4 }}>
                  <Tag color="blue">{item.value}</Tag>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 保存按钮 */}
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSave}
            size="large"
            style={{
              height: 48,
              fontSize: 15,
              fontWeight: 600,
              background: '#2563EB',
              border: 'none',
              borderRadius: 12,
              paddingInline: 32,
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            }}
          >
            保存设置
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminSettings
