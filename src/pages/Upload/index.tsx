import React, { useState, useEffect } from 'react'
import { Card, Upload, Button, Table, Tag, Space, Progress, message, Typography, Modal } from 'antd'
import { motion } from 'framer-motion'
import { InboxOutlined, UploadOutlined, FileTextOutlined, FilePdfOutlined, FileExcelOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { uploadApi } from '@/services/api'

const { Text, Title } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const UploadPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewContent, setPreviewContent] = useState<any>(null)

  useEffect(() => { fetchDocuments() }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await uploadApi.getList()
      const result = response.data
      if (result.code === 0) setDocuments(result.data.items)
    } catch (error) { console.error('获取文档列表失败:', error) }
    finally { setLoading(false) }
  }

  const handleUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await uploadApi.upload(formData)
      const result = response.data
      if (result.code === 0) { message.success('上传成功'); fetchDocuments() }
      else message.error(result.message || '上传失败')
    } catch (error) { message.error('上传失败') }
    return false
  }

  const handlePreview = async (id: string) => {
    try {
      const response = await uploadApi.getDetail(id)
      const result = response.data
      if (result.code === 0) { setPreviewContent(result.data); setPreviewVisible(true) }
    } catch (error) { message.error('预览失败') }
  }

  const getFileIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = { pdf: <FilePdfOutlined style={{ color: '#ef4444' }} />, docx: <FileTextOutlined style={{ color: '#667eea' }} />, doc: <FileTextOutlined style={{ color: '#667eea' }} />, xlsx: <FileExcelOutlined style={{ color: '#059669' }} />, xls: <FileExcelOutlined style={{ color: '#059669' }} />, md: <FileTextOutlined style={{ color: '#d97706' }} />, txt: <FileTextOutlined style={{ color: '#64748b' }} /> }
    return icons[type] || <FileTextOutlined style={{ color: '#64748b' }} />
  }

  const columns = [
    { title: '文件名', dataIndex: 'filename', key: 'filename', render: (text: string, record: any) => (
      <Space>{getFileIcon(record.type)}<Text style={{ color: '#1e293b', fontWeight: 600 }}>{text}</Text></Space>
    )},
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag style={{ background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.2)', color: '#667eea', borderRadius: 100 }}>{type?.toUpperCase()}</Tag> },
    { title: '大小', dataIndex: 'size', key: 'size', render: (size: number) => <Text style={{ color: '#94a3b8' }}>{size ? `${(size / 1024).toFixed(1)} KB` : '-'}</Text> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
      const s: Record<string, { bg: string; color: string; border: string; label: string }> = {
        processing: { bg: 'rgba(245,158,11,0.1)', color: '#d97706', border: 'rgba(245,158,11,0.2)', label: '解析中' },
        completed: { bg: 'rgba(16,185,129,0.1)', color: '#059669', border: 'rgba(16,185,129,0.2)', label: '已完成' },
        failed: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'rgba(239,68,68,0.2)', label: '失败' },
      }
      const c = s[status] || s.processing
      return <Tag style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, borderRadius: 100, fontWeight: 500 }}>{c.label}</Tag>
    }},
    { title: '上传时间', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => <Text style={{ color: '#94a3b8' }}>{new Date(date).toLocaleString()}</Text> },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record.id)} style={{ color: '#667eea' }} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="text" size="small" icon={<ReloadOutlined />} onClick={fetchDocuments} style={{ color: '#94a3b8' }} />
        </motion.div>
      </Space>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ ...glass }}>
        <div style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4} style={{ color: '#1e293b', marginBottom: 4, fontWeight: 700 }}>文档上传</Title>
            <Text style={{ color: '#94a3b8' }}>支持 PDF、Word、Excel、Markdown 等格式</Text>
          </div>

          <motion.div whileHover={{ borderColor: '#667eea', boxShadow: '0 0 0 3px rgba(102,126,234,0.08)' }}
            style={{ marginBottom: 32, borderRadius: 20, border: '2px dashed rgba(148,163,184,0.3)', background: 'rgba(248,250,252,0.4)', transition: 'all 0.2s' }}>
            <Upload.Dragger beforeUpload={handleUpload} showUploadList={false} accept=".pdf,.doc,.docx,.xls,.xlsx,.md,.txt,.csv" style={{ padding: '40px 0', background: 'transparent', border: 'none' }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <InboxOutlined style={{ fontSize: 56, color: '#667eea', marginBottom: 16 }} />
              </motion.div>
              <Title level={5} style={{ color: '#1e293b', marginBottom: 4 }}>点击或拖拽文件到此区域上传</Title>
              <Text style={{ color: '#94a3b8' }}>支持单个文件最大 100MB</Text>
            </Upload.Dragger>
          </motion.div>

          <Title level={5} style={{ color: '#1e293b', marginBottom: 16, fontWeight: 700 }}>文档列表</Title>
          <Table columns={columns} dataSource={documents} rowKey="id" loading={loading} style={{ background: 'transparent' }}
            pagination={{ pageSize: 10, showTotal: (total) => <Text style={{ color: '#94a3b8' }}>共 {total} 个文档</Text> }} />
        </div>
      </div>

      <Modal title="文档预览" open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={null} width={700}>
        {previewContent && (
          <div>
            <Title level={5} style={{ color: '#1e293b' }}>{previewContent.filename}</Title>
            <div style={{ background: 'rgba(248,250,252,0.6)', borderRadius: 14, padding: 20, marginTop: 16, whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.8, maxHeight: 500, overflow: 'auto', border: '1px solid rgba(148,163,184,0.1)' }}>{previewContent.content}</div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default UploadPage
