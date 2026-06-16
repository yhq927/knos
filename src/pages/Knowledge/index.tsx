import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, message, Popconfirm, Tree, Row, Col, Drawer, Typography } from 'antd'
import { motion } from 'framer-motion'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FolderOutlined, BookOutlined } from '@ant-design/icons'
import { knowledgeApi } from '@/services/api'
import type { KnowledgeItem } from '@/types'

const { Text, Title } = Typography
const { TextArea } = Input

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const Knowledge: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [form] = Form.useForm()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [viewingItem, setViewingItem] = useState<KnowledgeItem | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryForm] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })

  const knowledgeTypes = [
    { value: 'faq', label: 'FAQ' }, { value: 'sop', label: 'SOP/流程' },
    { value: 'technical', label: '技术文档' }, { value: 'training', label: '培训资料' },
    { value: 'experience', label: '经验沉淀' }, { value: 'other', label: '其他' },
  ]

  useEffect(() => { fetchItems(); fetchCategories() }, [pagination.current, searchText, filterType])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await knowledgeApi.getList({ page: pagination.current, pageSize: pagination.pageSize, search: searchText, type: filterType })
      const result = response.data
      if (result.code === 0) { setItems(result.data.items); setPagination(prev => ({ ...prev, total: result.data.total })) }
    } catch (error) { console.error('获取知识列表失败:', error) }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      // TODO: category API not yet implemented
      setCategories([])
    } catch (error) { console.error('获取分类失败:', error) }
  }

  const handleAdd = () => { setEditingItem(null); form.resetFields(); setModalVisible(true) }
  const handleEdit = (record: KnowledgeItem) => { setEditingItem(record); form.setFieldsValue(record); setModalVisible(true) }
  const handleView = (record: KnowledgeItem) => { setViewingItem(record); setDrawerVisible(true) }

  const handleDelete = async (id: string) => {
    try { await knowledgeApi.delete(id); message.success('删除成功'); fetchItems() }
    catch (error) { message.error('删除失败') }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingItem) { await knowledgeApi.update(editingItem.id, values); message.success('更新成功') }
      else { await knowledgeApi.create(values); message.success('创建成功') }
      setModalVisible(false); fetchItems()
    } catch (error) { console.error('保存失败:', error) }
  }

  const handleAddCategory = () => { setEditingCategory(null); categoryForm.resetFields(); setCategoryModalVisible(true) }

  const handleSaveCategory = async () => {
    try {
      // TODO: category API not yet implemented
      message.info('分类功能即将上线')
      setCategoryModalVisible(false)
    } catch (error) { console.error('保存失败:', error) }
  }

  const handleDeleteCategory = async (id: string) => {
    // TODO: category API not yet implemented
    message.info('分类功能即将上线')
  }

  const buildCategoryTree = (parentId: string | null = null): any[] => {
    return categories.filter((c: any) => c.parentId === parentId).map((c: any) => ({
      key: c.id, title: c.name, icon: <FolderOutlined style={{ color: '#667eea' }} />,
      children: buildCategoryTree(c.id).length > 0 ? buildCategoryTree(c.id) : undefined,
    }))
  }

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title', render: (text: string) => <Text style={{ color: '#1e293b', fontWeight: 600 }}>{text}</Text> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => {
      const colors: Record<string, { bg: string; color: string; border: string }> = {
        faq: { bg: 'rgba(102,126,234,0.1)', color: '#667eea', border: 'rgba(102,126,234,0.2)' },
        sop: { bg: 'rgba(16,185,129,0.1)', color: '#059669', border: 'rgba(16,185,129,0.2)' },
        technical: { bg: 'rgba(245,158,11,0.1)', color: '#d97706', border: 'rgba(245,158,11,0.2)' },
        training: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'rgba(239,68,68,0.2)' },
        experience: { bg: 'rgba(139,92,246,0.1)', color: '#7c3aed', border: 'rgba(139,92,246,0.2)' },
        other: { bg: 'rgba(148,163,184,0.1)', color: '#64748b', border: 'rgba(148,163,184,0.2)' },
      }
      const c = colors[type] || colors.other
      return <Tag style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, borderRadius: 100, fontWeight: 500 }}>{knowledgeTypes.find(t => t.value === type)?.label || type}</Tag>
    }},
    { title: '来源', dataIndex: 'source', key: 'source', render: (source: string) => <Tag style={{ background: 'rgba(79,172,254,0.1)', border: '1px solid rgba(79,172,254,0.2)', color: '#0ea5e9', borderRadius: 100 }}>{source === 'manual' ? '手动录入' : source === 'ai_collect' ? 'AI采集' : source === 'document' ? '文档解析' : '行业知识'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag style={{ background: status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, color: status === 'active' ? '#059669' : '#d97706', borderRadius: 100 }}>{status === 'active' ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => <Text style={{ color: '#94a3b8' }}>{new Date(date).toLocaleDateString()}</Text> },
    {
      title: '操作', key: 'action', render: (_: any, record: KnowledgeItem) => (
        <Space>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} style={{ color: '#667eea' }} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#f59e0b' }} />
          </motion.div>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="text" size="small" icon={<DeleteOutlined />} style={{ color: '#ef4444' }} />
            </motion.div>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ ...glass }}>
        <div style={{ padding: 24 }}>
          <Row gutter={24}>
            <Col span={6}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ color: '#1e293b', margin: 0, fontWeight: 700 }}>分类目录</Title>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddCategory}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 8, fontWeight: 600 }}>新建</Button>
                </motion.div>
              </div>
              <div style={{ background: 'rgba(248,250,252,0.6)', borderRadius: 14, padding: 12, border: '1px solid rgba(148,163,184,0.1)' }}>
                <Tree treeData={buildCategoryTree()} showIcon defaultExpandAll />
              </div>
            </Col>
            <Col span={18}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ color: '#1e293b', margin: 0, fontWeight: 700 }}>知识条目</Title>
                <Space>
                  <Input placeholder="搜索知识条目..." prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} value={searchText}
                    onChange={e => setSearchText(e.target.value)} onPressEnter={fetchItems}
                    style={{ width: 240, borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
                  <Select placeholder="类型筛选" allowClear value={filterType || undefined} onChange={v => setFilterType(v || '')}
                    options={knowledgeTypes} style={{ width: 140 }} />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 16px rgba(102,126,234,0.3)' }}>新建知识</Button>
                  </motion.div>
                </Space>
              </div>
              <Table columns={columns} dataSource={items} rowKey="id" loading={loading} style={{ background: 'transparent' }}
                pagination={{ ...pagination, showSizeChanger: false, showTotal: (total) => <Text style={{ color: '#94a3b8' }}>共 {total} 条</Text>,
                  onChange: (page) => setPagination(prev => ({ ...prev, current: page })) }} />
            </Col>
          </Row>
        </div>
      </div>

      <Modal title={editingItem ? '编辑知识' : '新建知识'} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} width={700} okText="保存" cancelText="取消">
        <Form form={form} layout="vertical"><Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}><Input placeholder="请输入标题" /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}><Select placeholder="请选择类型" options={knowledgeTypes} /></Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}><TextArea rows={8} placeholder="请输入知识内容" /></Form.Item>
          <Form.Item name="tags" label="标签"><Select mode="tags" placeholder="输入标签后回车" /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="active"><Select options={[{ value: 'active', label: '启用' }, { value: 'inactive', label: '禁用' }]} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingCategory ? '编辑分类' : '新建分类'} open={categoryModalVisible} onOk={handleSaveCategory} onCancel={() => setCategoryModalVisible(false)} okText="保存" cancelText="取消">
        <Form form={categoryForm} layout="vertical"><Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入名称' }]}><Input placeholder="请输入分类名称" /></Form.Item>
          <Form.Item name="parentId" label="父级分类"><Select allowClear placeholder="无（顶级分类）" options={categories.map((c: any) => ({ value: c.id, label: c.name }))} /></Form.Item>
        </Form>
      </Modal>

      <Drawer title="知识详情" open={drawerVisible} onClose={() => setDrawerVisible(false)} width={600}>
        {viewingItem && (
          <div>
            <Title level={4} style={{ color: '#1e293b' }}>{viewingItem.title}</Title>
            <Space style={{ marginBottom: 16 }}><Tag style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea', borderRadius: 100 }}>{viewingItem.type}</Tag><Tag style={{ background: 'rgba(79,172,254,0.1)', color: '#0ea5e9', borderRadius: 100 }}>{viewingItem.source}</Tag></Space>
            <div style={{ background: 'rgba(248,250,252,0.6)', borderRadius: 14, padding: 20, marginTop: 16, whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.8, border: '1px solid rgba(148,163,184,0.1)' }}>{viewingItem.content}</div>
            {viewingItem.tags && viewingItem.tags.length > 0 && (
              <div style={{ marginTop: 16 }}>{viewingItem.tags.map((tag: string, i: number) => <Tag key={i} style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed', borderRadius: 100 }}>{tag}</Tag>)}</div>
            )}
          </div>
        )}
      </Drawer>
    </motion.div>
  )
}

export default Knowledge
