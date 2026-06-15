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

const { Title, Text, Paragraph } = Typography
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
      render: (text: string) => <Text style={{ color: '#fff' }}>{text}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</Text>,
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
      render: (text: string) => <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(text).toLocaleDateString('zh-CN')}</Text>,
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
          <Button type="text" danger style={{ color: '#f5576c' }}>移除</Button>
        </Popconfirm>
      ),
    },
  ]

  const unitColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text style={{ color: '#fff' }}>{text}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          style={{
            background: status === 'active' ? 'rgba(67, 233, 123, 0.2)' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${status === 'active' ? 'rgba(67, 233, 123, 0.3)' : 'rgba(255,255,255,0.15)'}`,
            color: status === 'active' ? '#43e97b' : 'rgba(255,255,255,0.5)',
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
            style={{ color: '#667eea' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该业务单元吗？"
            onConfirm={() => handleDeleteUnit(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger style={{ color: '#f5576c' }}>删除</Button>
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
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
            title="当前套餐"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={4} style={{ color: '#fff', marginBottom: 0 }}>
                  {planInfo?.planType === 'pro' ? '专业版' : '免费版'}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  升级到专业版
                </Button>
              )}
            </div>
          </Card>
          <Card
            title="使用情况"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: '#fff' }}>AI问答配额</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {usageInfo?.aiUsed || 0} / {usageInfo?.aiLimit || 50} 次
                </Text>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: '#fff' }}>存储空间</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {usageInfo?.storageUsed || 0} MB / {usageInfo?.storageLimit || 500} MB
                </Text>
              </div>
            </div>
            <div>
              <Text style={{ color: '#fff' }}>成员数量</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
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
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
            <SettingOutlined style={{ marginRight: 12 }} />
            设置
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
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

      <style>{`
        .ant-tabs .ant-tabs-tab {
          color: rgba(255,255,255,0.5) !important;
        }
        .ant-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #667eea !important;
        }
        .ant-tabs .ant-tabs-ink-bar {
          background: #667eea !important;
        }
        .ant-table {
          background: transparent !important;
        }
        .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.05) !important;
          color: rgba(255,255,255,0.8) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .ant-table-tbody > tr > td {
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(102, 126, 234, 0.1) !important;
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
        .ant-form-item-label > label {
          color: rgba(255,255,255,0.8) !important;
        }
      `}</style>
    </div>
  )
}

export default Settings
