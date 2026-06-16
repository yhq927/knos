import React, { useState, useEffect, useRef } from 'react'
import { Card, Input, Button, List, Avatar, Tag, Space, Typography, Spin, message, Tooltip } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { SendOutlined, UserOutlined, RobotOutlined, LikeOutlined, DislikeOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons'
import { chatApi } from '@/services/api'
import type { ChatMessage } from '@/types'

const { Text } = Typography

/* Glass card */
const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 24,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [currentContent, setCurrentContent] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<any>(null)

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  useEffect(() => { scrollToBottom() }, [messages, currentContent])

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return
    const userMessage: ChatMessage = { id: Date.now().toString(), conversationId: '', role: 'user', content: inputValue, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMessage])
    setInputValue(''); setLoading(true); setStreaming(true); setCurrentContent('')

    try {
      const aiMessageId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, { id: aiMessageId, conversationId: '', role: 'assistant', content: '', createdAt: new Date().toISOString() }])

      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
          for (const line of text.split('\n')) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'message_delta') { fullContent += data.data.content; setCurrentContent(fullContent) }
                else if (data.type === 'message_end') {
                  setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, content: fullContent, sources: data.data.sources, confidence: data.data.confidence, followUpQuestions: data.data.followUpQuestions } : msg))
                } else if (data.type === 'error') { message.error(data.data.message || 'AI服务不可用') }
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      message.error('发送失败，请重试'); setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false); setStreaming(false); setCurrentContent(''); inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }
  const handleFeedback = async (messageId: string, type: 'helpful' | 'not_helpful') => { try { await chatApi.sendFeedback(messageId, type); message.success('感谢反馈') } catch { message.error('反馈失败') } }
  const handleCopy = (content: string) => { navigator.clipboard.writeText(content); message.success('已复制') }
  const getConfidenceColor = (c?: string) => ({ high: '#10b981', medium: '#f59e0b', low: '#ef4444' }[c || ''] || '#94a3b8')
  const getConfidenceText = (c?: string) => ({ high: '高置信度', medium: '中置信度', low: '低置信度' }[c || ''] || '')

  return (
    <div style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...glass, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '100px 0' }}>
                <motion.div
                  style={{
                    width: 88, height: 88, borderRadius: 28,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 28px', boxShadow: '0 16px 40px -8px rgba(102,126,234,0.4)',
                  }}
                  animate={{ y: [-6, 6, -6], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <RobotOutlined style={{ fontSize: 44, color: '#fff' }} />
                </motion.div>
                <Title level={3} style={{ color: '#1e293b', marginBottom: 8, fontWeight: 700 }}>有什么可以帮您的？</Title>
                <Text style={{ color: '#94a3b8', fontSize: 16 }}>基于企业知识库的AI问答，为您精准解答</Text>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <List.Item style={{ borderBottom: 'none', padding: '10px 0' }}>
                      <div style={{ display: 'flex', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {msg.role === 'assistant' && (
                          <Avatar icon={<RobotOutlined />} style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            marginRight: 12, width: 42, height: 42, flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
                          }} />
                        )}
                        <div style={{
                          maxWidth: '72%', padding: '16px 22px',
                          borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                          background: msg.role === 'user'
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'rgba(255,255,255,0.7)',
                          border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.6)' : 'none',
                          color: msg.role === 'user' ? '#fff' : '#1e293b',
                          boxShadow: msg.role === 'user'
                            ? '0 8px 24px -4px rgba(102,126,234,0.35)'
                            : '0 2px 8px rgba(0,0,0,0.04)',
                        }}>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.id === messages[messages.length - 1]?.id && streaming && !msg.content
                              ? currentContent || <Spin size="small" /> : msg.content}
                          </div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <Space size={[4, 4]} wrap>
                                {msg.sources.map((source, i) => (
                                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                    <Tag style={{
                                      background: source.type === 'enterprise' ? 'rgba(102,126,234,0.1)' : source.type === 'industry' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                                      border: `1px solid ${source.type === 'enterprise' ? 'rgba(102,126,234,0.2)' : source.type === 'industry' ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)'}`,
                                      color: source.type === 'enterprise' ? '#667eea' : source.type === 'industry' ? '#059669' : '#64748b',
                                      borderRadius: 100, fontSize: 11, fontWeight: 500,
                                    }}>
                                      {source.type === 'enterprise' ? '企业知识' : source.type === 'industry' ? '行业知识' : 'AI知识'}
                                    </Tag>
                                  </motion.div>
                                ))}
                              </Space>
                            </div>
                          )}
                          {msg.confidence && (
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: getConfidenceColor(msg.confidence) }}
                                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                              <Text style={{ fontSize: 12, color: '#94a3b8' }}>{getConfidenceText(msg.confidence)}</Text>
                            </div>
                          )}
                          {msg.role === 'assistant' && msg.content && (
                            <div style={{ marginTop: 12, borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 10 }}>
                              <Space>
                                <Tooltip title="有用"><Button type="text" size="small" icon={<LikeOutlined />} onClick={() => handleFeedback(msg.id, 'helpful')} style={{ color: '#94a3b8' }} /></Tooltip>
                                <Tooltip title="无用"><Button type="text" size="small" icon={<DislikeOutlined />} onClick={() => handleFeedback(msg.id, 'not_helpful')} style={{ color: '#94a3b8' }} /></Tooltip>
                                <Tooltip title="复制"><Button type="text" size="small" icon={<CopyOutlined />} onClick={() => handleCopy(msg.content)} style={{ color: '#94a3b8' }} /></Tooltip>
                              </Space>
                            </div>
                          )}
                          {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <Text style={{ fontSize: 12, color: '#94a3b8' }}>相关问题：</Text>
                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {msg.followUpQuestions.map((q, i) => (
                                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                                    <Tag style={{ cursor: 'pointer', background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.15)', color: '#667eea', borderRadius: 100 }}
                                      onClick={() => { setInputValue(q); inputRef.current?.focus() }}>{q}</Tag>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <Avatar icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', marginLeft: 12, width: 42, height: 42, boxShadow: '0 4px 12px rgba(79,172,254,0.3)' }} />
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
          <motion.div style={{ padding: '20px 28px', borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(248,250,252,0.6)' }}
            animate={{ boxShadow: inputFocused ? '0 -4px 20px rgba(99,102,241,0.06)' : '0 0 0 transparent' }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input.TextArea ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                placeholder="输入您的问题..." autoSize={{ minRows: 1, maxRows: 4 }} disabled={loading}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.8)',
                  border: inputFocused ? '1px solid rgba(102,126,234,0.4)' : '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '16px 0 0 16px', color: '#1e293b',
                  boxShadow: inputFocused ? '0 0 0 3px rgba(102,126,234,0.08)' : 'none',
                  transition: 'all 0.2s',
                }} />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading} disabled={!inputValue.trim()}
                  style={{
                    height: 'auto', minHeight: 54,
                    background: inputValue.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                    border: 'none', borderRadius: '0 16px 16px 0', fontWeight: 600,
                    boxShadow: inputValue.trim() ? '0 4px 16px rgba(102,126,234,0.3)' : 'none',
                  }}>发送</Button>
              </motion.div>
            </Space.Compact>
            <div style={{ marginTop: 10, textAlign: 'right' }}>
              <Button type="text" size="small" icon={<ClearOutlined />} onClick={() => { setMessages([]); message.success('对话已清空') }}
                disabled={messages.length === 0} style={{ color: '#94a3b8' }}>清空对话</Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Chat
