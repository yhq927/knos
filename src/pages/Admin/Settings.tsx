import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, message, Space, Tag, Row, Col } from 'antd'
import { motion } from 'framer-motion'
import { SaveOutlined, ApiOutlined, GlobalOutlined, MailOutlined, InfoCircleOutlined } from '@ant-design/icons'
import api from '@/services/api'

const { Title, Text } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<any>({})
  const [form] = Form.useForm()

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings')
      const result = response.data
      if (result.code === 0) { setSettings(result.data); form.setFieldsValue(result.data) }
    } catch (error) { console.error('获取设置失败:', error) }
  }

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      const response = await api.put('/admin/settings', values)
      const result = response.data
      if (result.code === 0) { message.success('保存成功'); setSettings(result.data) }
      else message.error(result.message || '保存失败')
    } catch (error) { message.error('保存失败') }
    finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ color: '#1e293b', marginBottom: 4, fontWeight: 700 }}>系统设置</Title>
        <Text style={{ color: '#94a3b8' }}>管理平台全局配置</Text>
      </div>

      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* API Key */}
        <div style={{ ...glass }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ApiOutlined style={{ color: '#667eea' }} />
            <Text style={{ color: '#1e293b', fontWeight: 700 }}>API Key 设置</Text>
          </div>
          <div style={{ padding: 24 }}>
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="defaultApiKey" label="默认 API Key" extra="用于未配置自定义Key的企业">
                    <Input.Password placeholder="输入平台默认 API Key" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="defaultBaseUrl" label="默认 Base URL">
                    <Input placeholder="https://api.openai.com/v1" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="apiKeyRateLimit" label="API Key 调用限制" extra="每分钟最大调用次数">
                <Input type="number" placeholder="60" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Website Widget */}
        <div style={{ ...glass }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GlobalOutlined style={{ color: '#667eea' }} />
            <Text style={{ color: '#1e293b', fontWeight: 700 }}>Website Widget 设置</Text>
          </div>
          <div style={{ padding: 24 }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ padding: 20, borderRadius: 14, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
                <Text style={{ color: '#475569', fontSize: 14, lineHeight: 1.8 }}>
                  Widget 功能允许企业将 AI 问答嵌入到自己的官网中，客户可以直接在官网上提问。
                </Text>
              </div>
              <Form.Item name="widgetAllowedDomains" label="允许的域名" extra="每行一个域名">
                <Input.TextArea rows={3} placeholder="example.com&#10;www.example.com" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
              </Form.Item>
              <Form.Item name="widgetRateLimit" label="Widget 调用限制" extra="每小时最大调用次数">
                <Input type="number" placeholder="100" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
              </Form.Item>
            </Space>
          </div>
        </div>

        {/* SMTP */}
        <div style={{ ...glass }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MailOutlined style={{ color: '#667eea' }} />
            <Text style={{ color: '#1e293b', fontWeight: 700 }}>SMTP 设置</Text>
          </div>
          <div style={{ padding: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="smtpHost" label="SMTP 服务器"><Input placeholder="smtp.example.com" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="smtpPort" label="端口"><Input placeholder="465" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="smtpUser" label="用户名"><Input placeholder="noreply@example.com" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="smtpPassword" label="密码"><Input.Password placeholder="输入密码" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
              </Col>
            </Row>
            <Form.Item name="smtpFrom" label="发件人地址"><Input placeholder="noreply@example.com" style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
          </div>
        </div>

        {/* Info */}
        <div style={{ ...glass }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <InfoCircleOutlined style={{ color: '#667eea' }} />
            <Text style={{ color: '#1e293b', fontWeight: 700 }}>系统信息</Text>
          </div>
          <div style={{ padding: 24 }}>
            <Space direction="vertical" size={12}>
              <div><Text style={{ color: '#94a3b8', marginRight: 12 }}>版本：</Text><Tag style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea', borderRadius: 100 }}>v1.0.0</Tag></div>
              <div><Text style={{ color: '#94a3b8', marginRight: 12 }}>数据库：</Text><Tag style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', borderRadius: 100 }}>已连接</Tag></div>
              <div><Text style={{ color: '#94a3b8', marginRight: 12 }}>缓存：</Text><Tag style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', borderRadius: 100 }}>Redis 已连接</Tag></div>
            </Space>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={() => form.submit()}
              style={{ height: 48, padding: '0 32px', borderRadius: 14, fontWeight: 600, fontSize: 15,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none',
                boxShadow: '0 8px 24px rgba(102,126,234,0.3)' }}>保存所有设置</Button>
          </motion.div>
        </div>
      </Space>
    </motion.div>
  )
}

export default AdminSettings
