import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Tag,
  Space,
  Typography,
  Spin,
  message,
  Tooltip,
} from 'antd'
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  LikeOutlined,
  DislikeOutlined,
  CopyOutlined,
  ClearOutlined,
} from '@ant-design/icons'
import { chatApi } from '@/services/api'
import type { ChatMessage } from '@/types'

const { Text } = Typography

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [currentContent, setCurrentContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentContent])

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId: '',
      role: 'user',
      content: inputValue,
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setStreaming(true)
    setCurrentContent('')

    try {
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        conversationId: '',
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMessage])

      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) throw new Error('请求失败')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          const lines = text.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                switch (data.type) {
                  case 'message_delta':
                    fullContent += data.data.content
                    setCurrentContent(fullContent)
                    break
                  case 'message_end':
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === aiMessageId
                          ? {
                              ...msg,
                              content: fullContent,
                              sources: data.data.sources,
                              confidence: data.data.confidence,
                              followUpQuestions: data.data.followUpQuestions,
                            }
                          : msg
                      )
                    )
                    break
                  case 'error':
                    message.error(data.data.message || 'AI服务不可用')
                    break
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      message.error('发送失败，请重试')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      setStreaming(false)
      setCurrentContent('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFeedback = async (messageId: string, type: 'helpful' | 'not_helpful') => {
    try {
      await chatApi.sendFeedback(messageId, type)
      message.success('感谢您的反馈')
    } catch (error) {
      message.error('反馈失败')
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  const handleClear = () => {
    setMessages([])
    message.success('对话已清空')
  }

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case 'high': return '#10B981'
      case 'medium': return '#F59E0B'
      case 'low': return '#EF4444'
      default: return '#9CA3AF'
    }
  }

  const getConfidenceText = (confidence?: string) => {
    switch (confidence) {
      case 'high': return '高置信度'
      case 'medium': return '中置信度'
      case 'low': return '低置信度'
      default: return ''
    }
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <Card
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 } }}
      >
        {/* 消息列表 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                }}
              >
                <RobotOutlined style={{ fontSize: 40, color: '#fff' }} />
              </div>
              <Typography.Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
                有什么可以帮您的？
              </Typography.Title>
              <Text style={{ color: '#6B7280', fontSize: 16 }}>
                基于企业知识库的AI问答，为您精准解答
              </Text>
            </div>
          ) : (
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item style={{ borderBottom: 'none', padding: '12px 0' }}>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar
                        icon={<RobotOutlined />}
                        style={{
                          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                          marginRight: 12,
                          width: 40,
                          height: 40,
                        }}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '16px 20px',
                        borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: msg.role === 'user'
                          ? '#2563EB'
                          : '#F3F4F6',
                        border: msg.role === 'assistant' ? '1px solid #E5E7EB' : 'none',
                        color: msg.role === 'user' ? '#fff' : '#111827',
                      }}
                    >
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.id === messages[messages.length - 1]?.id && streaming && !msg.content
                          ? currentContent || <Spin size="small" />
                          : msg.content}
                      </div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <Space size={[4, 4]} wrap>
                            {msg.sources.map((source, index) => (
                              <Tag
                                key={index}
                                style={{
                                  background: source.type === 'enterprise'
                                    ? '#E0E7FF'
                                    : source.type === 'industry'
                                    ? '#D1FAE5'
                                    : '#F3F4F6',
                                  border: `1px solid ${
                                    source.type === 'enterprise'
                                      ? '#C7D2FE'
                                      : source.type === 'industry'
                                      ? '#A7F3D0'
                                      : '#E5E7EB'
                                  }`,
                                  color: source.type === 'enterprise'
                                    ? '#2563EB'
                                    : source.type === 'industry'
                                    ? '#059669'
                                    : '#6B7280',
                                  borderRadius: 100,
                                  fontSize: 11,
                                }}
                              >
                                {source.type === 'enterprise'
                                  ? '企业知识'
                                  : source.type === 'industry'
                                  ? '行业知识'
                                  : 'AI知识'}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}

                      {msg.confidence && (
                        <div style={{ marginTop: 8 }}>
                          <Space>
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: getConfidenceColor(msg.confidence),
                              }}
                            />
                            <Text style={{ fontSize: 12, color: '#6B7280' }}>
                              {getConfidenceText(msg.confidence)}
                            </Text>
                          </Space>
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.content && (
                        <div style={{ marginTop: 12, borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
                          <Space>
                            <Tooltip title="有用">
                              <Button
                                type="text"
                                size="small"
                                icon={<LikeOutlined />}
                                onClick={() => handleFeedback(msg.id, 'helpful')}
                                style={{ color: '#9CA3AF' }}
                              />
                            </Tooltip>
                            <Tooltip title="无用">
                              <Button
                                type="text"
                                size="small"
                                icon={<DislikeOutlined />}
                                onClick={() => handleFeedback(msg.id, 'not_helpful')}
                                style={{ color: '#9CA3AF' }}
                              />
                            </Tooltip>
                            <Tooltip title="复制">
                              <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(msg.content)}
                                style={{ color: '#9CA3AF' }}
                              />
                            </Tooltip>
                          </Space>
                        </div>
                      )}

                      {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>相关问题：</Text>
                          <div style={{ marginTop: 8 }}>
                            {msg.followUpQuestions.map((question, index) => (
                              <Tag
                                key={index}
                                style={{
                                  cursor: 'pointer',
                                  marginBottom: 4,
                                  background: '#E0E7FF',
                                  border: '1px solid #C7D2FE',
                                  color: '#2563EB',
                                  borderRadius: 100,
                                }}
                                onClick={() => {
                                  setInputValue(question)
                                  inputRef.current?.focus()
                                }}
                              >
                                {question}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <Avatar
                        icon={<UserOutlined />}
                        style={{
                          background: '#0EA5E9',
                          marginLeft: 12,
                          width: 40,
                          height: 40,
                        }}
                      />
                    )}
                  </div>
                </List.Item>
              )}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div
          style={{
            padding: '20px 24px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB',
          }}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input.TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={loading}
              style={{
                flex: 1,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '12px 0 0 12px',
                color: '#111827',
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!inputValue.trim()}
              style={{
                height: 'auto',
                background: '#2563EB',
                border: 'none',
                borderRadius: '0 12px 12px 0',
                fontWeight: 600,
              }}
            >
              发送
            </Button>
          </Space.Compact>
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={messages.length === 0}
              style={{ color: '#9CA3AF' }}
            >
              清空对话
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Chat
