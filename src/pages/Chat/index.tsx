import React, { useState, useEffect, useRef } from 'react'
import { Card, Input, Button, List, Avatar, Tag, Space, Typography, Spin, message, Tooltip } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SendOutlined, UserOutlined, RobotOutlined, LikeOutlined,
  DislikeOutlined, CopyOutlined, ClearOutlined,
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
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages, currentContent])

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(), conversationId: '', role: 'user',
      content: inputValue, createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setStreaming(true)
    setCurrentContent('')

    try {
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: ChatMessage = {
        id: aiMessageId, conversationId: '', role: 'assistant',
        content: '', createdAt: new Date().toISOString(),
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
                    setMessages(prev => prev.map(msg =>
                      msg.id === aiMessageId
                        ? { ...msg, content: fullContent, sources: data.data.sources, confidence: data.data.confidence, followUpQuestions: data.data.followUpQuestions }
                        : msg
                    ))
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleFeedback = async (messageId: string, type: 'helpful' | 'not_helpful') => {
    try { await chatApi.sendFeedback(messageId, type); message.success('感谢您的反馈') }
    catch { message.error('反馈失败') }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  const handleClear = () => { setMessages([]); message.success('对话已清空') }

  const getConfidenceColor = (c?: string) => ({ high: '#10B981', medium: '#F59E0B', low: '#EF4444' }[c || ''] || '#9CA3AF')
  const getConfidenceText = (c?: string) => ({ high: '高置信度', medium: '中置信度', low: '低置信度' }[c || ''] || '')

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(229,231,235,0.5)', borderRadius: 20,
          boxShadow: 'var(--shadow-sm)',
        }} styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 } }}>
          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '100px 0' }}
              >
                <motion.div
                  style={{
                    width: 80, height: 80, borderRadius: 24,
                    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 28px rgba(37,99,235,0.3)',
                  }}
                  animate={{ y: [-4, 4, -4], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <RobotOutlined style={{ fontSize: 40, color: '#fff' }} />
                </motion.div>
                <Typography.Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 8, fontWeight: 700 }}>
                  有什么可以帮您的？
                </Typography.Title>
                <Text style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                  基于企业知识库的AI问答，为您精准解答
                </Text>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <List.Item style={{ borderBottom: 'none', padding: '12px 0' }}>
                      <div style={{
                        display: 'flex', width: '100%',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}>
                        {msg.role === 'assistant' && (
                          <Avatar icon={<RobotOutlined />} style={{
                            background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
                            marginRight: 12, width: 40, height: 40,
                            boxShadow: '0 2px 8px rgba(37,99,235,0.2)',
                          }} />
                        )}
                        <div style={{
                          maxWidth: '70%', padding: '16px 20px',
                          borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          background: msg.role === 'user'
                            ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
                            : 'rgba(243, 244, 246, 0.8)',
                          border: msg.role === 'assistant' ? '1px solid rgba(229,231,235,0.5)' : 'none',
                          color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                          boxShadow: msg.role === 'user'
                            ? '0 4px 12px rgba(37,99,235,0.2)'
                            : 'var(--shadow-xs)',
                        }}>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.id === messages[messages.length - 1]?.id && streaming && !msg.content
                              ? currentContent || <Spin size="small" />
                              : msg.content}
                          </div>

                          {msg.sources && msg.sources.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <Space size={[4, 4]} wrap>
                                {msg.sources.map((source, i) => (
                                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                    <Tag style={{
                                      background: source.type === 'enterprise' ? '#E0E7FF' : source.type === 'industry' ? '#D1FAE5' : '#F3F4F6',
                                      border: `1px solid ${source.type === 'enterprise' ? '#C7D2FE' : source.type === 'industry' ? '#A7F3D0' : '#E5E7EB'}`,
                                      color: source.type === 'enterprise' ? '#2563EB' : source.type === 'industry' ? '#059669' : '#6B7280',
                                      borderRadius: 100, fontSize: 11,
                                    }}>
                                      {source.type === 'enterprise' ? '企业知识' : source.type === 'industry' ? '行业知识' : 'AI知识'}
                                    </Tag>
                                  </motion.div>
                                ))}
                              </Space>
                            </div>
                          )}

                          {msg.confidence && (
                            <div style={{ marginTop: 8 }}>
                              <Space>
                                <motion.div
                                  style={{ width: 8, height: 8, borderRadius: '50%', background: getConfidenceColor(msg.confidence) }}
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                                <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>{getConfidenceText(msg.confidence)}</Text>
                              </Space>
                            </div>
                          )}

                          {msg.role === 'assistant' && msg.content && (
                            <div style={{ marginTop: 12, borderTop: '1px solid rgba(229,231,235,0.5)', paddingTop: 12 }}>
                              <Space>
                                <Tooltip title="有用"><Button type="text" size="small" icon={<LikeOutlined />} onClick={() => handleFeedback(msg.id, 'helpful')} style={{ color: 'var(--text-muted)' }} /></Tooltip>
                                <Tooltip title="无用"><Button type="text" size="small" icon={<DislikeOutlined />} onClick={() => handleFeedback(msg.id, 'not_helpful')} style={{ color: 'var(--text-muted)' }} /></Tooltip>
                                <Tooltip title="复制"><Button type="text" size="small" icon={<CopyOutlined />} onClick={() => handleCopy(msg.content)} style={{ color: 'var(--text-muted)' }} /></Tooltip>
                              </Space>
                            </div>
                          )}

                          {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>相关问题：</Text>
                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {msg.followUpQuestions.map((q, i) => (
                                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                                    <Tag
                                      style={{ cursor: 'pointer', background: '#E0E7FF', border: '1px solid #C7D2FE', color: '#2563EB', borderRadius: 100 }}
                                      onClick={() => { setInputValue(q); inputRef.current?.focus() }}
                                    >{q}</Tag>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <Avatar icon={<UserOutlined />} style={{
                            background: '#0EA5E9', marginLeft: 12, width: 40, height: 40,
                          }} />
                        )}
                      </div>
                    </List.Item>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <motion.div
            style={{
              padding: '20px 24px', borderTop: '1px solid rgba(229,231,235,0.5)',
              background: 'rgba(249,250,251,0.6)', backdropFilter: 'blur(8px)',
            }}
            animate={{
              boxShadow: inputFocused ? '0 -4px 16px rgba(37,99,235,0.05)' : '0 0 0 transparent',
            }}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input.TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="输入您的问题..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={loading}
                style={{
                  flex: 1, background: 'var(--bg-card)',
                  border: inputFocused ? '1px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '14px 0 0 14px', color: 'var(--text-primary)',
                  boxShadow: inputFocused ? '0 0 0 3px rgba(37,99,235,0.08)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  loading={loading}
                  disabled={!inputValue.trim()}
                  style={{
                    height: 'auto', minHeight: 52,
                    background: inputValue.trim() ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' : undefined,
                    border: 'none', borderRadius: '0 14px 14px 0', fontWeight: 600,
                    boxShadow: inputValue.trim() ? '0 2px 8px rgba(37,99,235,0.2)' : 'none',
                  }}
                >发送</Button>
              </motion.div>
            </Space.Compact>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <Button type="text" size="small" icon={<ClearOutlined />} onClick={handleClear}
                disabled={messages.length === 0} style={{ color: 'var(--text-muted)' }}
              >清空对话</Button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Chat
