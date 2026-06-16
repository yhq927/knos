import React, { useState, useEffect } from 'react'
import {
  Card,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Tag,
  message,
  Modal,
  Popconfirm,
  Switch,
  Typography,
} from 'antd'
import { motion } from 'framer-motion'
import {
  SettingOutlined,
  KeyOutlined,
  TeamOutlined,
  ShopOutlined,
  GlobalOutlined,
  CreditCardOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { enterpriseApi, membersApi, businessUnitsApi, billingApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography
const { TextArea } = Input

const Settings: React.FC = () => {
  const { enterprise } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [businessUnits, setBusinessUnits] = useState<any[]>([])
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const [unitModalVisible, setUnitModalVisible] = useState(false)
  const [editingUnit, setEditingUnit] = useState<any>(null)
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [usageInfo, setUsageInfo] = useState<any>(null)

  const [basicForm] = Form.useForm()
  const [apiKeyForm] = Form.useForm()
  const [inviteForm] = Form.useForm()
  const [unitForm] = Form.useForm()
  const [publicForm] = Form.useForm()

  useEffect(() => {
    fetchMembers()
    fetchBusinessUnits()
    fetchPlanInfo()
    fetchUsageInfo()
    if (enterprise) {
      basicForm.setFieldsValue({
        name: enterprise.name,
        industry: enterprise.industry,
        size: enterprise.size,
        description: enterprise.description,
        contactPhone: enterprise.contactPhone,
        contactEmail: enterprise.contactEmail,
      })
      publicForm.setFieldsValue({
        publicEnabled: enterprise.settings?.publicEnabled || false,
        welcomeMessage: enterprise.settings?.welcomeMessage || '',
      })
    }
  }, [enterprise])

  const fetchMembers = async () => {
    try {
      const response = await membersApi.getList()
      const result = response.data
      if (result.code === 0) {
        setMembers(result.data.list)
      }
    } catch (error) {}
  }

  const fetchBusinessUnits = async () => {
    try {
      const response = await businessUnitsApi.getList()
      const result = response.data
      if (result.code === 0) {
        setBusinessUnits(result.data)
      }
    } catch (error) {}
  }

  const fetchPlanInfo = async () => {
    try {
      const response = await billingApi.getPlan()
      const result = response.data
      if (result.code === 0) {
        setPlanInfo(result.data)
      }
    } catch (error) {}
  }

  const fetchUsageInfo = async () => {
    try {
      const response = await billingApi.getUsage()
      const result = response.data
      if (result.code === 0) {
        setUsageInfo(result.data)
      }
    } catch (error) {}
  }

  const handleSaveBasic = async () => {
    try {
      const values = await basicForm.validateFields()
      setLoading(true)
      await enterpriseApi.update(values)
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiKey = async () => {
    try {
      const values = await apiKeyForm.validateFields()
      setLoading(true)
      await enterpriseApi.update({ apiKeys: values })
      message.success('API Key保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleTestApiKey = async (provider: string) => {
    try {
      const apiKey = apiKeyForm.getFieldValue(provider)
      if (!apiKey) {
        message.warning('请先输入API Key')
        return
      }
      await enterpriseApi.testApiKey({ provider, apiKey })
      message.success('API Key测试成功')
    } catch (error) {
      message.error('API Key测试失败')
    }
  }

  const handleInvite = async () => {
    try {
      const values = await inviteForm.validateFields()
      await membersApi.invite(values)
      message.success('邀请已发送')
      setInviteModalVisible(false)
      inviteForm.resetFields()
      fetchMembers()
    } catch (error) {
      message.error('邀请失败')
    }
  }

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await membersApi.updateRole(id, role)
      message.success('角色更新成功')
      fetchMembers()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleRemoveMember = async (id: string) => {
    try {
      await membersApi.remove(id)
      message.success('成员已移除')
      fetchMembers()
    } catch (error) {
      message.error('移除失败')
    }
  }

  const handleSaveUnit = async () => {
    try {
      const values = await unitForm.validateFields()
      if (editingUnit) {
        await businessUnitsApi.update(editingUnit.id, values)
        message.success('更新成功')
      } else {
        await businessUnitsApi.create(values)
        message.success('创建成功')
      }
      setUnitModalVisible(false)
      unitForm.resetFields()
      setEditingUnit(null)
      fetchBusinessUnits()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleDeleteUnit = async (id: string) => {
    try {
      await businessUnitsApi.delete(id)
      message.success('删除成功')
      fetchBusinessUnits()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleCopyWidgetCode = () => {
    const code = `<script src="https://widget.knosai.com/v1/loader.js" data-enterprise="${enterprise?.slug}" data-position="bottom-right"></script>`
    navigator.clipboard.writeText(code)
    message.success('代码已复制到剪贴板')
  }

  const handleCopyLink = () => {
    const link = `https://knosai.com/p/${enterprise?.slug}`
    navigator.clipboard.writeText(link)
    message.success('链接已复制到剪贴板')
  }

  const memberColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text style={{ color: '#111827' }}>{text}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{text}</Text>,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: any) => (
        <Select
          value={role}
          style={{ width: 120 }}
          onChange={(value) => handleUpdateRole(record.id, value)}
          options={[
            { value: 'admin', label: '管理员' },
            { value: 'editor', label: '编辑者' },
            { value: 'viewer', label: '只读' },
          ]}
        />
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{new Date(text).toLocaleDateString('zh-CN')}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定移除该成员吗？"
          onConfirm={() => handleRemoveMember(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger style={{ color: '#DC2626' }}>移除</Button>
        </Popconfirm>
      ),
    },
  ]

  const unitColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text style={{ color: '#111827' }}>{text}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{text}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          style={{
            background: status === 'active' ? '#D1FAE5' : '#F3F4F6',
            border: `1px solid ${status === 'active' ? '#A7F3D0' : '#E5E7EB'}`,
            color: status === 'active' ? '#059669' : '#6B7280',
            borderRadius: 100,
          }}
        >
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            onClick={() => {
              setEditingUnit(record)
              unitForm.setFieldsValue(record)
              setUnitModalVisible(true)
            }}
            style={{ color: '#2563EB' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该业务单元吗？"
            onConfirm={() => handleDeleteUnit(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger style={{ color: '#DC2626' }}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'basic',
      label: <span><SettingOutlined /> 基本信息</span>,
      children: (
        <Form form={basicForm} layout="vertical">
          <Form.Item name="name" label="企业名称" rules={[{ required: true }]}>
            <Input placeholder="请输入企业名称" />
          </Form.Item>
          <Form.Item name="industry" label="所属行业" rules={[{ required: true }]}>
            <Select
              placeholder="请选择行业"
              options={[
                { value: 'technology', label: '科技/互联网' },
                { value: 'finance', label: '金融' },
                { value: 'healthcare', label: '医疗健康' },
                { value: 'education', label: '教育' },
                { value: 'retail', label: '零售' },
                { value: 'manufacturing', label: '制造业' },
                { value: 'consulting', label: '咨询服务' },
                { value: 'other', label: '其他' },
              ]}
            />
          </Form.Item>
          <Form.Item name="size" label="企业规模">
            <Select
              placeholder="请选择企业规模"
              allowClear
              options={[
                { value: '1-10', label: '1-10人' },
                { value: '11-50', label: '11-50人' },
                { value: '51-200', label: '51-200人' },
                { value: '201-500', label: '201-500人' },
                { value: '500+', label: '500人以上' },
              ]}
            />
          </Form.Item>
          <Form.Item name="description" label="企业简介">
            <TextArea rows={4} placeholder="请输入企业简介" />
          </Form.Item>
          <Form.Item name="contactPhone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="contactEmail" label="联系邮箱">
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSaveBasic}
              loading={loading}
              style={{
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'apikey',
      label: <span><KeyOutlined /> API Key</span>,
      children: (
        <Form form={apiKeyForm} layout="vertical">
          <Form.Item name="openai" label="OpenAI API Key">
            <Input.Password placeholder="sk-..." addonAfter={
              <Button type="link" onClick={() => handleTestApiKey('openai')}>测试</Button>
            } />
          </Form.Item>
          <Form.Item name="claude" label="Claude API Key">
            <Input.Password placeholder="sk-ant-..." addonAfter={
              <Button type="link" onClick={() => handleTestApiKey('claude')}>测试</Button>
            } />
          </Form.Item>
          <Form.Item name="tongyi" label="通义千问 API Key">
            <Input.Password placeholder="sk-..." addonAfter={
              <Button type="link" onClick={() => handleTestApiKey('tongyi')}>测试</Button>
            } />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSaveApiKey}
              loading={loading}
              style={{
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'members',
      label: <span><TeamOutlined /> 成员管理</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => setInviteModalVisible(true)}
              style={{
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              邀请成员
            </Button>
          </div>
          <Table columns={memberColumns} dataSource={members} rowKey="id" />
        </div>
      ),
    },
    {
      key: 'units',
      label: <span><ShopOutlined /> 业务单元</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => {
                setEditingUnit(null)
                unitForm.resetFields()
                setUnitModalVisible(true)
              }}
              style={{
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              新建业务单元
            </Button>
          </div>
          <Table columns={unitColumns} dataSource={businessUnits} rowKey="id" />
        </div>
      ),
    },
    {
      key: 'public',
      label: <span><GlobalOutlined /> 对外服务</span>,
      children: (
        <Form form={publicForm} layout="vertical">
          <Form.Item name="publicEnabled" label="开启对外服务" valuePropName="checked">
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
          <Form.Item label="对外访问链接">
            <Space>
              <Input
                value={`https://knosai.com/p/${enterprise?.slug}`}
                disabled
                style={{ width: 400 }}
              />
              <Button icon={<CopyOutlined />} onClick={handleCopyLink}>复制</Button>
            </Space>
          </Form.Item>
          <Form.Item name="welcomeMessage" label="欢迎语">
            <TextArea rows={3} placeholder="请输入对外AI问答的欢迎语" />
          </Form.Item>
          <Form.Item label="Widget代码">
            <Space>
              <Input
                value={`<script src="https://widget.knosai.com/v1/loader.js" data-enterprise="${enterprise?.slug}" data-position="bottom-right"></script>`}
                disabled
                style={{ width: 500 }}
              />
              <Button icon={<CopyOutlined />} onClick={handleCopyWidgetCode}>复制</Button>
            </Space>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={async () => {
                const values = await publicForm.validateFields()
                await enterpriseApi.update({ settings: values })
                message.success('保存成功')
              }}
              style={{
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'billing',
      label: <span><CreditCardOutlined /> 套餐与账单</span>,
      children: (
        <div>
          <Card
            title={<span style={{ color: '#111827', fontWeight: 600 }}>当前套餐</span>}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={4} style={{ color: '#111827', marginBottom: 0 }}>
                  {planInfo?.planType === 'pro' ? '专业版' : '免费版'}
                </Title>
                <Text style={{ color: '#6B7280' }}>
                  {planInfo?.planType === 'pro' ? '¥299/月' : '¥0'}
                </Text>
              </div>
              {planInfo?.planType !== 'pro' && (
                <Button
                  type="primary"
                  onClick={async () => {
                    const response = await billingApi.upgrade('pro')
                    const result = response.data
                    if (result.code === 0) {
                      window.location.href = result.data.paymentUrl
                    }
                  }}
                  style={{
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  }}
                >
                  升级到专业版
                </Button>
              )}
            </div>
          </Card>
          <Card
            title={<span style={{ color: '#111827', fontWeight: 600 }}>使用情况</span>}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: '#111827' }}>AI问答配额</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: '#6B7280' }}>
                  {usageInfo?.aiUsed || 0} / {usageInfo?.aiLimit || 50} 次
                </Text>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: '#111827' }}>存储空间</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: '#6B7280' }}>
                  {usageInfo?.storageUsed || 0} MB / {usageInfo?.storageLimit || 500} MB
                </Text>
              </div>
            </div>
            <div>
              <Text style={{ color: '#111827' }}>成员数量</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: '#6B7280' }}>
                  {usageInfo?.memberCount || 1} / {usageInfo?.memberLimit || 10} 人
                </Text>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}
    >
      <Card
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(229,231,235,0.5)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-sm)',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
            <SettingOutlined style={{ marginRight: 12 }} />
            设置
          </Title>
          <Text style={{ color: '#6B7280', fontSize: 16 }}>
            管理企业配置、API Key、成员权限、对外服务等
          </Text>
        </div>

        <Tabs items={tabItems} tabPosition="left" />
      </Card>

      {/* 邀请成员弹窗 */}
      <Modal
        title="邀请成员"
        open={inviteModalVisible}
        onOk={handleInvite}
        onCancel={() => setInviteModalVisible(false)}
        okText="发送邀请"
        cancelText="取消"
      >
        <Form form={inviteForm} layout="vertical">
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入成员邮箱" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select
              placeholder="请选择角色"
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'editor', label: '编辑者' },
                { value: 'viewer', label: '只读' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 业务单元弹窗 */}
      <Modal
        title={editingUnit ? '编辑业务单元' : '新建业务单元'}
        open={unitModalVisible}
        onOk={handleSaveUnit}
        onCancel={() => {
          setUnitModalVisible(false)
          setEditingUnit(null)
          unitForm.resetFields()
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={unitForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="请输入业务单元名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  )
}

export default Settings
