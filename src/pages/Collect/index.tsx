import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Progress, List, Tag, Space, Input, message, Spin } from 'antd'
import { motion } from 'framer-motion'
import { FormOutlined, CheckCircleOutlined, ForwardOutlined, RobotOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { collectApi } from '@/services/api'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface Goal {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  total: number
}

interface Question {
  id: string
  goalId: string
  content: string
  type: string
}

const Collect: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [completedQuestions, setCompletedQuestions] = useState<any[]>([])

  useEffect(() => { fetchGoals(); fetchCurrentQuestion() }, [])

  const fetchGoals = async () => {
    try {
      const response = await collectApi.getGoals()
      const result = response.data
      if (result.code === 0) {
        setGoals(result.data)
        const inProgress = result.data.find((g: Goal) => g.status === 'in_progress')
        if (inProgress) setCurrentGoal(inProgress)
      }
    } catch (error) { console.error('fetch goals failed:', error) }
  }

  const fetchCurrentQuestion = async () => {
    setLoading(true)
    try {
      const response = await collectApi.getCurrentQuestion()
      const result = response.data
      if (result.code === 0) setCurrentQuestion(result.data)
    } catch (error) { console.error('fetch question failed:', error) }
    finally { setLoading(false) }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) { message.warning('Please enter an answer'); return }
    setSubmitting(true)
    try {
      await collectApi.submitAnswer(currentQuestion!.id, answer)
      setCompletedQuestions(prev => [...prev, { question: currentQuestion!.content, answer }])
      setAnswer('')
      await fetchCurrentQuestion()
      await fetchGoals()
      message.success('Answer submitted')
    } catch (error) { message.error('Submit failed') }
    finally { setSubmitting(false) }
  }

  const handleSkipQuestion = async () => {
    if (!currentQuestion) return
    try { await collectApi.skipQuestion(currentQuestion.id); await fetchCurrentQuestion(); message.info('Question skipped') }
    catch (error) { message.error('Skip failed') }
  }

  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.reduce((sum, g) => sum + g.total, 0) * 100)
    : 0
  const isAllCompleted = goals.length > 0 && goals.every(g => g.status === 'completed')
  const statusLabel = (s: string) => s === 'completed' ? 'Done' : s === 'in_progress' ? 'Active' : 'Pending'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}
    >
      <Card style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(229,231,235,0.5)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-sm)',
      }} styles={{ body: { padding: 32 } }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
            <FormOutlined style={{ marginRight: 12 }} />Knowledge Collection
          </Title>
          <Text style={{ color: '#6B7280', fontSize: 16 }}>Use AI-guided Q&amp;A to systematically capture enterprise knowledge</Text>
        </div>

        <Card style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          marginBottom: 32,
        }} styles={{ body: { padding: 24 } }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#111827', fontWeight: 600, fontSize: 16 }}>Overall Progress</Text>
            <Text style={{ color: '#2563EB', fontWeight: 700, fontSize: 18 }}>{totalProgress}%</Text>
          </div>
          <Progress percent={totalProgress} showInfo={false} strokeColor="#2563EB" trailColor="#F3F4F6" />
        </Card>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Card title={<span style={{ color: '#111827', fontWeight: 600 }}>Goals</span>} style={{
            width: 320,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            flexShrink: 0,
          }} styles={{ body: { padding: 0 } }}>
            <List dataSource={goals} renderItem={(goal) => (
              <List.Item style={{
                cursor: 'pointer',
                background: currentGoal?.id === goal.id ? '#E0E7FF' : 'transparent',
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
              }} onClick={() => setCurrentGoal(goal)}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#111827', fontWeight: 600 }}>{goal.name}</Text>
                    <Tag style={{
                      background: goal.status === 'completed' ? '#D1FAE5' : goal.status === 'in_progress' ? '#E0E7FF' : '#F3F4F6',
                      border: '1px solid ' + (goal.status === 'completed' ? '#A7F3D0' : goal.status === 'in_progress' ? '#C7D2FE' : '#E5E7EB'),
                      color: goal.status === 'completed' ? '#059669' : goal.status === 'in_progress' ? '#2563EB' : '#6B7280',
                      borderRadius: 100,
                      fontSize: 11,
                    }}>{statusLabel(goal.status)}</Tag>
                  </div>
                  <Text style={{ color: '#6B7280', fontSize: 12, display: 'block', marginBottom: 8 }}>{goal.description}</Text>
                  <Progress percent={Math.round((goal.progress / goal.total) * 100)} size="small" showInfo={false} strokeColor="#2563EB" trailColor="#F3F4F6" />
                </div>
              </List.Item>
            )} />
          </Card>

          <Card style={{
            flex: 1,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            minWidth: 0,
          }} styles={{ body: { padding: 32 } }}>
            {isAllCompleted ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 24,
                  background: '#D1FAE5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <CheckCircleOutlined style={{ fontSize: 40, color: '#059669' }} />
                </div>
                <Title level={3} style={{ color: '#111827', marginBottom: 12, fontWeight: 700 }}>Knowledge Base Ready!</Title>
                <Paragraph style={{ color: '#6B7280', fontSize: 16, marginBottom: 32 }}>
                  Collected {goals.reduce((sum, g) => sum + g.progress, 0)} knowledge entries
                </Paragraph>
                <Space>
                  <Button type="primary" size="large" style={{
                    background: '#2563EB', border: 'none', borderRadius: 12, fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  }} onClick={() => navigate('/chat')}>Ask AI</Button>
                  <Button size="large" style={{
                    background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 12,
                    color: '#374151', fontWeight: 600,
                  }} onClick={() => navigate('/upload')}>Upload More</Button>
                </Space>
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" /><div style={{ marginTop: 16, color: '#6B7280' }}>Preparing questions...</div>
              </div>
            ) : currentQuestion ? (
              <div>
                <Tag style={{
                  marginBottom: 24, padding: '6px 16px', borderRadius: 100, fontSize: 13,
                  background: '#E0E7FF', border: '1px solid #C7D2FE', color: '#2563EB',
                }}>{currentGoal?.name || 'Knowledge Collection'}</Tag>
                <Card style={{
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  marginBottom: 24,
                }} styles={{ body: { padding: 24 } }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <RobotOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                    <Title level={4} style={{ color: '#111827', margin: 0, lineHeight: 1.6 }}>{currentQuestion.content}</Title>
                  </div>
                </Card>
                <div style={{ marginBottom: 24 }}>
                  <TextArea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    rows={4}
                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, color: '#111827', marginBottom: 16 }}
                  />
                  <Space>
                    <Button type="primary" onClick={handleSubmitAnswer} loading={submitting} disabled={!answer.trim()} style={{
                      background: '#2563EB', border: 'none', borderRadius: 10, fontWeight: 600, height: 44, padding: '0 24px',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    }}>Submit</Button>
                    <Button icon={<ForwardOutlined />} onClick={handleSkipQuestion} style={{
                      background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 10, color: '#374151', height: 44,
                    }}>Skip</Button>
                  </Space>
                </div>
                {completedQuestions.length > 0 && (
                  <div>
                    <Title level={5} style={{ color: '#374151', marginBottom: 16, fontWeight: 700 }}>Answered Questions ({completedQuestions.length})</Title>
                    <List dataSource={completedQuestions.slice(-5).reverse()} renderItem={(item) => (
                      <List.Item style={{ borderBottom: '1px solid #F3F4F6', padding: '12px 0' }}>
                        <div>
                          <Text style={{ color: '#111827', fontWeight: 600, display: 'block', marginBottom: 4 }}>{item.question}</Text>
                          <Text style={{ color: '#6B7280' }}>{item.answer}</Text>
                        </div>
                      </List.Item>
                    )} />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>No questions available</div>
            )}
          </Card>
        </div>
      </Card>
    </motion.div>
  )
}

export default Collect
