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
  Progress,
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

const { Text, Paragraph } = Typography

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [currentContent, setCurrentContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<any>(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentContent])

  // 发送消息
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
      // 创建AI消息占位
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        conversationId: '',
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMessage])

      // 调用流式API
      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error('请求失败')
      }

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
                    // 更新最终消息
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
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      message.error('发送失败，请重试')
      // 移除失败的AI消息
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      setStreaming(false)
      setCurrentContent('')
      inputRef.current?.focus()
    }
  }

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 反馈
  const handleFeedback = async (messageId: string, type: 'helpful' | 'not_helpful') => {
    try {
      await chatApi.sendFeedback(messageId, type)
      message.success('感谢您的反馈')
    } catch (error) {
      message.error('反馈失败')
    }
  }

  // 复制内容
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  // 清空对话
  const handleClear = () => {
    setMessages([])
    message.success('对话已清空')
  }

  // 置信度颜色
  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case 'high': return '#52c41a'
      case 'medium': return '#faad14'
      case 'low': return '#ff4d4f'
      default: return '#d9d9d9'
    }
  }

  // 置信度文本
  const getConfidenceText = (confidence?: string) => {
    switch (confidence) {
      case 'high': return '高置信度'
      case 'medium': return '中置信度'
      case 'low': return '低置信度'
      default: return ''
    }
  }

  return (
    <div className="page-container fade-in" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <Card
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
      >
        {/* 消息列表 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <RobotOutlined style={{ fontSize: 64, color: '#0F766E', marginBottom: 16 }} />
              <Text type="secondary" style={{ display: 'block', fontSize: 16 }}>
                有什么可以帮您的？
              </Text>
              <Text type="secondary">
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
                        style={{ backgroundColor: '#0F766E', marginRight: 12 }}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: msg.role === 'user' ? '#0F766E' : '#f5f5f4',
                        color: msg.role === 'user' ? '#fff' : '#333',
                      }}
                    >
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.id === messages[messages.length - 1]?.id && streaming && !msg.content
                          ? currentContent || <Spin size="small" />
                          : msg.content}
                      </div>

                      {/* 来源标注 */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <Space size={[4, 4]} wrap>
                            {msg.sources.map((source, index) => (
                              <Tag
                                key={index}
                                color={
                                  source.type === 'enterprise'
                                    ? 'blue'
                                    : source.type === 'industry'
                                    ? 'green'
                                    : 'default'
                                }
                                style={{ fontSize: 11 }}
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

                      {/* 置信度 */}
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
                            <Text style={{ fontSize: 12, color: '#999' }}>
                              {getConfidenceText(msg.confidence)}
                            </Text>
                          </Space>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      {msg.role === 'assistant' && msg.content && (
                        <div style={{ marginTop: 8 }}>
                          <Space>
                            <Tooltip title="有用">
                              <Button
                                type="text"
                                size="small"
                                icon={<LikeOutlined />}
                                onClick={() => handleFeedback(msg.id, 'helpful')}
                              />
                            </Tooltip>
                            <Tooltip title="无用">
                              <Button
                                type="text"
                                size="small"
                                icon={<DislikeOutlined />}
                                onClick={() => handleFeedback(msg.id, 'not_helpful')}
                              />
                            </Tooltip>
                            <Tooltip title="复制">
                              <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(msg.content)}
                              />
                            </Tooltip>
                          </Space>
                        </div>
                      )}

                      {/* 相关追问 */}
                      {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <Text style={{ fontSize: 12, color: '#999' }}>相关问题：</Text>
                          <div style={{ marginTop: 4 }}>
                            {msg.followUpQuestions.map((question, index) => (
                              <Tag
                                key={index}
                                style={{ cursor: 'pointer', marginBottom: 4 }}
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
                        style={{ backgroundColor: '#1890ff', marginLeft: 12 }}
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
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input.TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!inputValue.trim()}
            >
              发送
            </Button>
          </Space.Compact>
          <div style={{ marginTop: 8, textAlign: 'right' }}>
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={messages.length === 0}
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
