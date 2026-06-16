import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Space, Button, Input, message, Modal, Form, Select, Typography } from 'antd'
import { motion } from 'framer-motion'
import { SearchOutlined, EditOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'
import api from '@/services/api'

const { Title, Text } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const AdminEnterprises: React.FC = () => {
  const [enterprises, setEnterprises] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingEnterprise, setEditingEnterprise] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => { fetchEnterprises() }, [])

  const fetchEnterprises = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/enterprises', { params: { search: searchText } })
      const result = response.data
      if (result.code === 0) setEnterprises(result.data.items)
    } catch (error) { console.error('获取企业列表失败:', error) }
    finally { setLoading(false) }
  }

  const handleEdit = (record: any) => { setEditingEnterprise(record); form.setFieldsValue(record); setEditModalVisible(true) }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await api.put(`/admin/enterprises/${editingEnterprise.id}`, values)
      message.success('更新成功'); setEditModalVisible(false); fetchEnterprises()
    } catch (error) { message.error('更新失败') }
  }

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/enterprises/${id}`, { status: status === 'active' ? 'disabled' : 'active' })
      message.success('状态已更新'); fetchEnterprises()
    } catch (error) { message.error('操作失败') }
  }

  const columns = [
    { title: '企业名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text style={{ color: '#1e293b', fontWeight: 600 }}>{text}</Text> },
    { title: '行业', dataIndex: 'industry', key: 'industry', render: (text: string) => <Tag style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea', borderRadius: 100 }}>{text || '-'}</Tag> },
    { title: '成员数', dataIndex: 'memberCount', key: 'memberCount', render: (count: number) => <Text style={{ color: '#64748b' }}>{count}</Text> },
    { title: '套餐', dataIndex: 'planType', key: 'planType', render: (plan: string) => <Tag style={{ background: plan === 'pro' ? 'rgba(139,92,246,0.1)' : 'rgba(148,163,184,0.1)', border: `1px solid ${plan === 'pro' ? 'rgba(139,92,246,0.2)' : 'rgba(148,163,184,0.2)'}`, color: plan === 'pro' ? '#7c3aed' : '#64748b', borderRadius: 100, fontWeight: 500 }}>{plan === 'pro' ? '专业版' : '免费版'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag style={{ background: status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, color: status === 'active' ? '#059669' : '#dc2626', borderRadius: 100, fontWeight: 500 }}>{status === 'active' ? '正常' : '已禁用'}</Tag> },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => <Text style={{ color: '#94a3b8' }}>{new Date(date).toLocaleDateString()}</Text> },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#667eea' }} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="text" size="small" icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record.id, record.status)}
            style={{ color: record.status === 'active' ? '#ef4444' : '#10b981' }} />
        </motion.div>
      </Space>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ color: '#1e293b', marginBottom: 4, fontWeight: 700 }}>企业管理</Title>
        <Text style={{ color: '#94a3b8' }}>管理所有注册企业</Text>
      </div>

      <div style={{ ...glass }}>
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
            <Input placeholder="搜索企业名称..." prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} value={searchText}
              onChange={e => setSearchText(e.target.value)} onPressEnter={fetchEnterprises}
              style={{ maxWidth: 320, borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="primary" onClick={fetchEnterprises}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600 }}>搜索</Button>
            </motion.div>
          </div>
          <Table columns={columns} dataSource={enterprises} rowKey="id" loading={loading}
            pagination={{ pageSize: 10, showTotal: (total) => <Text style={{ color: '#94a3b8' }}>共 {total} 家企业</Text> }}
            style={{ background: 'transparent' }} />
        </div>
      </div>

      <Modal title="编辑企业" open={editModalVisible} onOk={handleSave} onCancel={() => setEditModalVisible(false)} okText="保存" cancelText="取消">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="企业名称"><Input /></Form.Item>
          <Form.Item name="industry" label="行业"><Input /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ value: 'active', label: '正常' }, { value: 'disabled', label: '禁用' }]} /></Form.Item>
          <Form.Item name="planType" label="套餐"><Select options={[{ value: 'free', label: '免费版' }, { value: 'pro', label: '专业版' }]} /></Form.Item>
        </Form>
      </Modal>
    </motion.div>
  )
}

export default AdminEnterprises
