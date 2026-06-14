import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Tree,
  Row,
  Col,
  Drawer,
  Typography,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  FileOutlined,
} from '@ant-design/icons'
import { knowledgeApi, businessUnitsApi } from '@/services/api'
import type { KnowledgeEntry, BusinessUnit } from '@/types'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const Knowledge: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeEntry[]>([])
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [keyword, setKeyword] = useState('')
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>()
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<KnowledgeEntry | null>(null)
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchKnowledge()
    fetchBusinessUnits()
  }, [page, pageSize, keyword, selectedUnit])

  const fetchKnowledge = async () => {
    setLoading(true)
    try {
      const response = await knowledgeApi.getList({
        page,
        pageSize,
        keyword,
        businessUnitId: selectedUnit,
      })
      setKnowledgeList(response.data.list)
      setTotal(response.data.total)
    } catch (error) {
      console.error('获取知识列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBusinessUnits = async () => {
    try {
      const response = await businessUnitsApi.getList()
      setBusinessUnits(response.data)
    } catch (error) {
      console.error('获取业务单元失败:', error)
    }
  }

  const handleCreate = () => {
    setEditingEntry(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: KnowledgeEntry) => {
    setEditingEntry(record)
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      contentType: record.contentType,
      visibility: record.visibility,
      businessUnitId: record.businessUnitId,
    })
    setModalVisible(true)
  }

  const handleView = (record: KnowledgeEntry) => {
    setCurrentEntry(record)
    setDrawerVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await knowledgeApi.delete(id)
      message.success('删除成功')
      fetchKnowledge()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingEntry) {
        await knowledgeApi.update(editingEntry.id, values)
        message.success('更新成功')
      } else {
        await knowledgeApi.create(values)
        message.success('创建成功')
      }
      
      setModalVisible(false)
      fetchKnowledge()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: KnowledgeEntry) => (
        <a onClick={() => handleView(record)}>{text}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'contentType',
      key: 'contentType',
      render: (type: string) => {
        const typeMap: Record<string, { color: string; label: string }> = {
          faq: { color: 'blue', label: 'FAQ' },
          sop: { color: 'green', label: 'SOP' },
          guide: { color: 'orange', label: '指南' },
          policy: { color: 'purple', label: '制度' },
          other: { color: 'default', label: '其他' },
        }
        const item = typeMap[type] || typeMap.other
        return <Tag color={item.color}>{item.label}</Tag>
      },
    },
    {
      title: '可见性',
      dataIndex: 'visibility',
      key: 'visibility',
      render: (visibility: string) => {
        const visibilityMap: Record<string, { color: string; label: string }> = {
          private: { color: 'red', label: '私密' },
          team: { color: 'blue', label: '团队可见' },
          link: { color: 'orange', label: '链接可见' },
          public: { color: 'green', label: '完全公开' },
        }
        const item = visibilityMap[visibility] || visibilityMap.private
        return <Tag color={item.color}>{item.label}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          draft: { color: 'default', label: '草稿' },
          review: { color: 'processing', label: '审核中' },
          published: { color: 'success', label: '已发布' },
          archived: { color: 'warning', label: '已归档' },
        }
        const item = statusMap[status] || statusMap.draft
        return <Tag color={item.color}>{item.label}</Tag>
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: KnowledgeEntry) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除这条知识吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 树形结构数据
  const treeData = [
    {
      title: '公司层',
      key: 'company',
      icon: <FolderOutlined />,
      children: businessUnits.map(unit => ({
        title: unit.name,
        key: unit.id,
        icon: <FolderOutlined />,
      })),
    },
  ]

  return (
    <div className="page-container fade-in">
      <Card>
        <Row gutter={24}>
          {/* 左侧树形导航 */}
          <Col xs={24} lg={6}>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>知识结构</Title>
            </div>
            <Tree
              showIcon
              defaultExpandAll
              selectedKeys={selectedUnit ? [selectedUnit] : ['company']}
              onSelect={(keys) => {
                const key = keys[0] as string
                setSelectedUnit(key === 'company' ? undefined : key)
              }}
              treeData={treeData}
            />
          </Col>

          {/* 右侧内容区 */}
          <Col xs={24} lg={18}>
            {/* 工具栏 */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input
                  placeholder="搜索知识条目"
                  prefix={<SearchOutlined />}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="类型筛选"
                  style={{ width: 120 }}
                  allowClear
                  options={[
                    { value: 'faq', label: 'FAQ' },
                    { value: 'sop', label: 'SOP' },
                    { value: 'guide', label: '指南' },
                    { value: 'policy', label: '制度' },
                  ]}
                />
              </Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新建知识
              </Button>
            </div>

            {/* 知识列表 */}
            <Table
              columns={columns}
              dataSource={knowledgeList}
              rowKey="id"
              loading={loading}
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                onChange: (page, pageSize) => {
                  setPage(page)
                  setPageSize(pageSize)
                },
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingEntry ? '编辑知识' : '新建知识'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入知识标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={10} placeholder="请输入知识内容" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="contentType"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select
                  placeholder="请选择类型"
                  options={[
                    { value: 'faq', label: 'FAQ' },
                    { value: 'sop', label: 'SOP' },
                    { value: 'guide', label: '指南' },
                    { value: 'policy', label: '制度' },
                    { value: 'other', label: '其他' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="visibility"
                label="可见性"
                initialValue="private"
              >
                <Select
                  options={[
                    { value: 'private', label: '私密' },
                    { value: 'team', label: '团队可见' },
                    { value: 'link', label: '链接可见' },
                    { value: 'public', label: '完全公开' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="businessUnitId"
                label="业务单元"
              >
                <Select
                  placeholder="请选择业务单元"
                  allowClear
                  options={businessUnits.map(unit => ({
                    value: unit.id,
                    label: unit.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="知识详情"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {currentEntry && (
          <div>
            <Title level={4}>{currentEntry.title}</Title>
            <Space style={{ marginBottom: 16 }}>
              <Tag color="blue">{currentEntry.contentType}</Tag>
              <Tag color={currentEntry.visibility === 'public' ? 'green' : 'default'}>
                {currentEntry.visibility}
              </Tag>
              <Tag color={currentEntry.status === 'published' ? 'success' : 'default'}>
                {currentEntry.status}
              </Tag>
            </Space>
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {currentEntry.content}
            </Paragraph>
            <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
              <p>创建时间：{new Date(currentEntry.createdAt).toLocaleString('zh-CN')}</p>
              <p>更新时间：{new Date(currentEntry.updatedAt).toLocaleString('zh-CN')}</p>
              <p>版本：v{currentEntry.version}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default Knowledge
