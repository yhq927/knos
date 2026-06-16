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
} from 'antd'
import {
  InboxOutlined,
  UploadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
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
      const result = response.data
      if (result.code === 0) {
        setFileList(result.data.list)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error('获取文件列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleReparse = async (id: string) => {
    try {
      await uploadApi.reparse(id)
      message.success('已重新提交解析')
      fetchFileList()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FilePdfOutlined style={{ color: '#DC2626' }} />
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileTextOutlined style={{ color: '#0EA5E9' }} />
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <FileExcelOutlined style={{ color: '#059669' }} />
    return <FileTextOutlined style={{ color: '#2563EB' }} />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'originalName',
      key: 'originalName',
      render: (text: string, record: FileUpload) => (
        <Space>
          {getFileIcon(record.mimeType)}
          <Text style={{ color: '#111827' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => <Text style={{ color: '#6B7280' }}>{formatFileSize(size)}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: FileUpload) => {
        const statusMap: Record<string, { bg: string; border: string; color: string; label: string }> = {
          pending: { bg: '#F3F4F6', border: '#E5E7EB', color: '#6B7280', label: '等待中' },
          processing: { bg: '#E0E7FF', border: '#C7D2FE', color: '#2563EB', label: '解析中' },
          completed: { bg: '#D1FAE5', border: '#A7F3D0', color: '#059669', label: '已完成' },
          failed: { bg: '#FEE2E2', border: '#FECACA', color: '#DC2626', label: '失败' },
        }
        const item = statusMap[status] || statusMap.pending
        return (
          <div>
            <Tag
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                color: item.color,
                borderRadius: 100,
              }}
            >
              {item.label}
            </Tag>
            {status === 'processing' && (
              <Progress
                percent={record.progress}
                size="small"
                showInfo={false}
                strokeColor="#2563EB"
                trailColor="#F3F4F6"
                style={{ marginTop: 8 }}
              />
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
          <Text style={{ color: '#059669' }}>提取 {count} 条知识</Text>
        ) : record.status === 'failed' ? (
          <Text style={{ color: '#DC2626' }}>{record.errorMessage || '解析失败'}</Text>
        ) : (
          <Text style={{ color: '#9CA3AF' }}>-</Text>
        )
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{new Date(text).toLocaleString('zh-CN')}</Text>,
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
              style={{ color: '#2563EB' }}
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
              style={{ color: '#2563EB' }}
            >
              查看
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
            <UploadOutlined style={{ marginRight: 12 }} />
            文档上传
          </Title>
          <Text style={{ color: '#6B7280', fontSize: 16 }}>
            上传文档文件，系统自动解析并提取知识
          </Text>
        </div>

        {/* 上传区域 */}
        <Card
          style={{
            background: '#F9FAFB',
            border: '2px dashed #2563EB',
            borderRadius: 16,
            marginBottom: 32,
          }}
          styles={{ body: { padding: 0 } }}
        >
          <Dragger {...uploadProps} style={{ background: 'transparent' }}>
            <div style={{ padding: '60px 0' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: '#E0E7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <InboxOutlined style={{ fontSize: 40, color: '#2563EB' }} />
              </div>
              <Title level={4} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
                点击或拖拽文件到此区域上传
              </Title>
              <Text style={{ color: '#6B7280' }}>
                支持 Word、PDF、Excel、Markdown、TXT 格式，单文件最大 100MB
              </Text>
            </div>
          </Dragger>
        </Card>

        {/* 文件列表 */}
        <Card
          title={<span style={{ color: '#111827', fontWeight: 600 }}>上传记录</span>}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
          }}
          styles={{ body: { padding: 0 } }}
        >
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
              showTotal: (total) => <span style={{ color: '#6B7280' }}>共 {total} 个文件</span>,
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
