import React, { useState, useEffect } from 'react'
import { Card, Tabs, Form, Input, Select, Button, Table, Space, Tag, message, Modal, Popconfirm, Switch, Typography } from 'antd'
import { motion } from 'framer-motion'
import { SettingOutlined, KeyOutlined, TeamOutlined, ShopOutlined, GlobalOutlined, CreditCardOutlined, CopyOutlined } from '@ant-design/icons'
import { enterpriseApi, membersApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const Settings: React.FC = () => {
  const { enterprise, user, updateUser, updateEnterprise } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [enterpriseLoading, setEnterpriseLoading] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [planModalVisible, setPlanModalVisible] = useState(false)
  const [inviteForm] = Form.useForm()

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = async () => {
    setMembersLoading(true)
    try {
      const response = await membersApi.getList()
      const result = response.data
      if (result.code === 0) setMembers(result.data)
    } catch (error) { console.error('获取成员失败:', error) }
    finally { setMembersLoading(false) }
  }

  const handleSaveProfile = async (values: any) => {
    setLoading(true)
    try {
      const response = await enterpriseApi.update(values)
      const result = response.data
      if (result.code === 0) { updateUser(result.data); message.success('保存成功') }
      else message.error(result.message || '保存失败')
    } catch (error) { message.error('保存失败') }
    finally { setLoading(false) }
  }

  const handleChangePassword = async (values: any) => {
    setPasswordLoading(true)
    try {
      // TODO: changePassword API not yet implemented
      message.info('密码修改功能即将上线')
    } catch (error) { message.error('修改失败') }
    finally { setPasswordLoading(false) }
  }

  const handleSaveEnterprise = async (values: any) => {
    setEnterpriseLoading(true)
    try {
      const response = await enterpriseApi.update(values)
      const result = response.data
      if (result.code === 0) { updateEnterprise(result.data); message.success('保存成功') }
      else message.error(result.message || '保存失败')
    } catch (error) { message.error('保存失败') }
    finally { setEnterpriseLoading(false) }
  }

  const handleInvite = async (values: any) => {
    try {
      const response = await membersApi.invite(values)
      const result = response.data
      if (result.code === 0) {
        setInviteLink(result.data.inviteLink || result.data.link || result.data)
        message.success('邀请链接已生成')
      }
    } catch (error) { message.error('生成邀请链接失败') }
  }

  const handleRemoveMember = async (id: string) => {
    try { await membersApi.remove(id); message.success('移除成功'); fetchMembers() }
    catch (error) { message.error('移除失败') }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    message.success('链接已复制')
  }

  const memberColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name', render: (text: string) => <Text style={{ color: '#1e293b', fontWeight: 600 }}>{text}</Text> },
    { title: '邮箱', dataIndex: 'email', key: 'email', render: (text: string) => <Text style={{ color: '#64748b' }}>{text}</Text> },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role: string) => <Tag style={{ background: role === 'admin' ? 'rgba(102,126,234,0.1)' : 'rgba(148,163,184,0.1)', border: `1px solid ${role === 'admin' ? 'rgba(102,126,234,0.2)' : 'rgba(148,163,184,0.2)'}`, color: role === 'admin' ? '#667eea' : '#64748b', borderRadius: 100, fontWeight: 500 }}>{role === 'admin' ? '管理员' : '成员'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag style={{ background: status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, color: status === 'active' ? '#059669' : '#d97706', borderRadius: 100 }}>{status === 'active' ? '已激活' : '待激活'}</Tag> },
    { title: '操作', key: 'action', render: (_: any, record: any) => record.role !== 'admin' ? (
      <Popconfirm title="确定移除？" onConfirm={() => handleRemoveMember(record.id)} okText="确定" cancelText="取消">
        <Button type="text" size="small" danger>移除</Button>
      </Popconfirm>
    ) : null },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ ...glass }}>
        <div style={{ padding: 32 }}>
          <Title level={4} style={{ color: '#1e293b', marginBottom: 24, fontWeight: 700 }}>设置</Title>

          <Tabs tabPosition="left" style={{ minHeight: 500 }}
            items={[
              { key: 'profile', label: <span><SettingOutlined style={{ marginRight: 8 }} />个人信息</span>, children: (
                <div style={{ maxWidth: 500 }}>
                  <Title level={5} style={{ color: '#1e293b', marginBottom: 20, fontWeight: 700 }}>个人信息</Title>
                  <Form layout="vertical" initialValues={user} onFinish={handleSaveProfile}>
                    <Form.Item name="name" label="姓名"><Input style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
                    <Form.Item name="email" label="邮箱"><Input disabled style={{ borderRadius: 10 }} /></Form.Item>
                    <Form.Item>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="primary" htmlType="submit" loading={loading}
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 16px rgba(102,126,234,0.3)' }}>保存修改</Button>
                      </motion.div>
                    </Form.Item>
                  </Form>
                </div>
              )},
              { key: 'password', label: <span><KeyOutlined style={{ marginRight: 8 }} />修改密码</span>, children: (
                <div style={{ maxWidth: 500 }}>
                  <Title level={5} style={{ color: '#1e293b', marginBottom: 20, fontWeight: 700 }}>修改密码</Title>
                  <Form layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item name="currentPassword" label="当前密码" rules={[{ required: true, message: '请输入当前密码' }]}><Input.Password style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
                    <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码' }, { min: 8, message: '密码至少8位' }]}><Input.Password style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
                    <Form.Item name="confirmPassword" label="确认新密码" dependencies={['newPassword']}
                      rules={[{ required: true, message: '请确认新密码' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error('两次输入的密码不一致')) } })]}>
                      <Input.Password style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
                    </Form.Item>
                    <Form.Item>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="primary" htmlType="submit" loading={passwordLoading}
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 16px rgba(102,126,234,0.3)' }}>修改密码</Button>
                      </motion.div>
                    </Form.Item>
                  </Form>
                </div>
              )},
              { key: 'enterprise', label: <span><ShopOutlined style={{ marginRight: 8 }} />企业设置</span>, children: (
                <div style={{ maxWidth: 500 }}>
                  <Title level={5} style={{ color: '#1e293b', marginBottom: 20, fontWeight: 700 }}>企业设置</Title>
                  <Form layout="vertical" initialValues={enterprise} onFinish={handleSaveEnterprise}>
                    <Form.Item name="companyName" label="企业名称"><Input style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
                    <Form.Item name="industry" label="所属行业"><Input style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
                    <Form.Item name="description" label="企业描述"><Input.TextArea rows={4} style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} /></Form.Item>
                    <Form.Item>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="primary" htmlType="submit" loading={enterpriseLoading}
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 16px rgba(102,126,234,0.3)' }}>保存设置</Button>
                      </motion.div>
                    </Form.Item>
                  </Form>
                </div>
              )},
              { key: 'members', label: <span><TeamOutlined style={{ marginRight: 8 }} />成员管理</span>, children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={5} style={{ color: '#1e293b', margin: 0, fontWeight: 700 }}>成员管理</Title>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="primary" onClick={() => setInviteModalVisible(true)}
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600 }}>邀请成员</Button>
                    </motion.div>
                  </div>
                  <Table columns={memberColumns} dataSource={members} rowKey="id" loading={membersLoading} pagination={false} style={{ background: 'transparent' }} />
                </div>
              )},
              { key: 'plan', label: <span><CreditCardOutlined style={{ marginRight: 8 }} />套餐管理</span>, children: (
                <div style={{ maxWidth: 500 }}>
                  <Title level={5} style={{ color: '#1e293b', marginBottom: 20, fontWeight: 700 }}>当前套餐</Title>
                  <div style={{ padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)', border: '1px solid rgba(102,126,234,0.15)', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text style={{ color: '#64748b', fontSize: 13, display: 'block' }}>当前套餐</Text>
                        <Text style={{ color: '#1e293b', fontSize: 20, fontWeight: 700 }}>{enterprise?.planType === 'pro' ? '专业版' : '免费版'}</Text>
                      </div>
                      <Tag style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderRadius: 100, padding: '4px 16px', fontWeight: 600 }}>{enterprise?.planType === 'pro' ? 'PRO' : 'FREE'}</Tag>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="primary" onClick={() => setPlanModalVisible(true)}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 16px rgba(102,126,234,0.3)' }}>升级套餐</Button>
                  </motion.div>
                </div>
              )},
            ]}
          />
        </div>
      </div>

      <Modal title="邀请成员" open={inviteModalVisible} onCancel={() => { setInviteModalVisible(false); setInviteLink('') }} footer={null}>
        <Form form={inviteForm} layout="vertical" onFinish={handleInvite}>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}><Input placeholder="输入成员邮箱" /></Form.Item>
          <Form.Item name="role" label="角色" initialValue="member"><Select options={[{ value: 'admin', label: '管理员' }, { value: 'member', label: '成员' }]} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10 }}>生成邀请链接</Button></Form.Item>
        </Form>
        {inviteLink && (
          <div style={{ background: 'rgba(248,250,252,0.6)', borderRadius: 12, padding: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(148,163,184,0.1)' }}>
            <Text style={{ color: '#475569', fontSize: 13, wordBreak: 'break-all' }}>{inviteLink}</Text>
            <Button type="text" icon={<CopyOutlined />} onClick={handleCopyLink} style={{ color: '#667eea' }} />
          </div>
        )}
      </Modal>

      <Modal title="升级套餐" open={planModalVisible} onCancel={() => setPlanModalVisible(false)} footer={null} width={600}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={4} style={{ color: '#1e293b', marginBottom: 8 }}>升级到专业版</Title>
          <Text style={{ color: '#64748b', display: 'block', marginBottom: 24 }}>解锁更多功能，提升团队效率</Text>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#1e293b', marginBottom: 24 }}>¥299<span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>/月</span></div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
            <Button type="primary" size="large" style={{ height: 52, padding: '0 40px', borderRadius: 14, fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', boxShadow: '0 8px 24px rgba(102,126,234,0.3)' }}>立即升级</Button>
          </motion.div>
        </div>
      </Modal>
    </motion.div>
  )
}

export default Settings
