import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Space, Button, Input, message, Modal, Form, Select, Typography } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const AdminEnterprises: React.FC = () => {
  const navigate = useNavigate()
  const [enterprises, setEnterprises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentEnterprise, setCurrentEnterprise] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchEnterprises()
  }, [])

  const fetchEnterprises = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/enterprises', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.code === 0) {
        setEnterprises(data.data.list)
      }
    } catch (error) {
      console.error('获取企业列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (enterprise: any) => {
    setCurrentEnterprise(enterprise)
    form.setFieldsValue(enterprise)
    setEditModalVisible(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const token = localStorage.getItem('admin_token')
      
      const response = await fetch(`/api/admin/enterprises?id=${currentEnterprise.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })
      
      const data = await response.json()
      if (data.code === 0) {
        message.success('更新成功')
        setEditModalVisible(false)
        fetchEnterprises()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleToggleStatus = async (enterprise: any) => {
    const newStatus = enterprise.status === 'active' ? 'disabled' : 'active'
    const action = newStatus === 'disabled' ? '禁用' : '启用'
    
    Modal.confirm({
      title: `确认${action}`,
      content: `确定要${action}企业"${enterprise.name}"吗？`,
      onOk: async () => {
        try {
          const token = localStorage.getItem('admin_token')
          const response = await fetch(`/api/admin/enterprises?id=${enterprise.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
          })
          
          const data = await response.json()
          if (data.code === 0) {
            message.success(`${action}成功`)
            fetchEnterprises()
          }
        } catch (error) {
          message.error('操作失败')
        }
      }
    })
  }

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text style={{ color: '#fff', fontWeight: 600 }}>{text}</Text>
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '规模',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: '套餐',
      dataIndex: 'planType',
      key: 'planType',
      render: (type: string) => (
        <Tag color={type === 'pro' ? 'gold' : type === 'enterprise' ? 'purple' : 'default'}>
          {type === 'pro' ? '专业版' : type === 'enterprise' ? '企业版' : '免费版'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#667eea' }}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
            danger={record.status === 'active'}
            style={{ color: record.status === 'active' ? '#f5576c' : '#43e97b' }}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
        </Space>
      )
    }
  ]

  const filteredEnterprises = enterprises.filter(e =>
    e.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#fff', marginBottom: 4 }}>企业管理</Title>
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>管理所有注册企业</Text>
      </div>

      <Card style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16
      }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索企业名称"
            prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: 300,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredEnterprises}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑企业"
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="企业名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="industry" label="行业" rules={[{ required: true }]}>
            <Select options={[
              { value: 'technology', label: '科技/互联网' },
              { value: 'finance', label: '金融' },
              { value: 'healthcare', label: '医疗健康' },
              { value: 'education', label: '教育' },
              { value: 'retail', label: '零售' },
              { value: 'manufacturing', label: '制造业' },
              { value: 'consulting', label: '咨询服务' },
              { value: 'other', label: '其他' }
            ]} />
          </Form.Item>
          <Form.Item name="planType" label="套餐">
            <Select options={[
              { value: 'free', label: '免费版' },
              { value: 'pro', label: '专业版' },
              { value: 'enterprise', label: '企业版' }
            ]} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[
              { value: 'active', label: '正常' },
              { value: 'disabled', label: '禁用' }
            ]} />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .ant-table { background: transparent !important; }
        .ant-table-thead > tr > th { background: rgba(255,255,255,0.05) !important; color: rgba(255,255,255,0.8) !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
        .ant-table-tbody > tr > td { color: rgba(255,255,255,0.7) !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .ant-table-tbody > tr:hover > td { background: rgba(102, 126, 234, 0.1) !important; }
        .ant-input { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; }
        .ant-input::placeholder { color: rgba(255,255,255,0.3) !important; }
        .ant-select-selector { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; }
      `}</style>
    </div>
  )
}

export default AdminEnterprises
