import React, { useState, useEffect } from 'react'
import {
  Card,
  Upload,
  Button,
  Table,
  Tag,
  Space,
  Progress,
  message,
  Typography,
  Modal,
  List,
} from 'antd'
import {
  InboxOutlined,
  UploadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { uploadApi } from '@/services/api'
import type { FileUpload } from '@/types'

const { Title, Text, Paragraph } = Typography
const { Dragger } = Upload

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<FileUpload[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileUpload | null>(null)

  useEffect(() => {
    fetchFileList()
  }, [page, pageSize])

  const fetchFileList = async () => {
    setLoading(true)
    try {
      const response = await uploadApi.getList({ page, pageSize })
      setFileList(response.data.list)
      setTotal(response.data.total)
    } catch (error) {
      console.error('获取文件列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/v1/upload',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    accept: '.doc,.docx,.pdf,.xls,.xlsx,.md,.txt',
    beforeUpload: (file: File) => {
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        message.error('文件大小不能超过100MB')
        return false
      }
      return true
    },
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        fetchFileList()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  // 重新解析
  const handleReparse = async (id: string) => {
    try {
      await uploadApi.reparse(id)
      message.success('已重新提交解析')
      fetchFileList()
    } catch (error) {
      message.error('操作失败')
    }
  }

  // 获取文件图标
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileTextOutlined style={{ color: '#1890ff' }} />
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <FileExcelOutlined style={{ color: '#52c41a' }} />
    return <FileTextOutlined />
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'originalName',
      key: 'originalName',
      render: (text: string, record: FileUpload) => (
        <Space>
          {getFileIcon(record.mimeType)}
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: FileUpload) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          pending: { color: 'default', label: '等待中' },
          processing: { color: 'processing', label: '解析中' },
          completed: { color: 'success', label: '已完成' },
          failed: { color: 'error', label: '失败' },
        }
        const item = statusMap[status] || statusMap.pending
        return (
          <div>
            <Tag color={item.color}>{item.label}</Tag>
            {status === 'processing' && (
              <Progress percent={record.progress} size="small" style={{ marginTop: 4 }} />
            )}
          </div>
        )
      },
    },
    {
      title: '解析结果',
      dataIndex: 'parsedCount',
      key: 'parsedCount',
      render: (count: number, record: FileUpload) => (
        record.status === 'completed' ? (
          <Text>提取 {count} 条知识</Text>
        ) : record.status === 'failed' ? (
          <Text type="danger">{record.errorMessage || '解析失败'}</Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FileUpload) => (
        <Space>
          {record.status === 'failed' && (
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => handleReparse(record.id)}
            >
              重试
            </Button>
          )}
          {record.status === 'completed' && (
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setPreviewFile(record)
                setPreviewVisible(true)
              }}
            >
              查看
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container fade-in">
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>
            <UploadOutlined style={{ marginRight: 8 }} />
            文档上传
          </Title>
          <Text type="secondary">
            上传文档文件，系统自动解析并提取知识
          </Text>
        </div>

        {/* 上传区域 */}
        <Card style={{ marginBottom: 24 }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持 Word、PDF、Excel、Markdown、TXT 格式，单文件最大 100MB
            </p>
          </Dragger>
        </Card>

        {/* 文件列表 */}
        <Card title="上传记录">
          <Table
            columns={columns}
            dataSource={fileList}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个文件`,
              onChange: (page, pageSize) => {
                setPage(page)
                setPageSize(pageSize)
              },
            }}
          />
        </Card>
      </Card>

      {/* 预览弹窗 */}
      <Modal
        title="解析结果预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewFile && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>文件名：</Text>
              <Text>{previewFile.originalName}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>解析状态：</Text>
              <Tag color="success">已完成</Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>提取知识条数：</Text>
              <Text>{previewFile.parsedCount} 条</Text>
            </div>
            <div>
              <Text strong>解析详情：</Text>
              <Paragraph>
                文档已成功解析，共提取 {previewFile.parsedCount} 条知识条目。
                您可以在知识库中查看和编辑这些内容。
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UploadPage
