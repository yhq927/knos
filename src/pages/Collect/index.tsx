import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Typography,
  Progress,
  List,
  Tag,
  Space,
  Input,
  message,
  Spin,
} from 'antd'
import {
  FormOutlined,
  CheckCircleOutlined,
  ForwardOutlined,
  RobotOutlined,
} from '@ant-design/icons'
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
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [completedQuestions, setCompletedQuestions] = useState<any[]>([])

  useEffect(() => {
    fetchGoals()
    fetchCurrentQuestion()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await collectApi.getGoals()
      setGoals(response.data)
      const inProgress = response.data.find((g: Goal) => g.status === 'in_progress')
      if (inProgress) setCurrentGoal(inProgress)
    } catch (error) {
      console.error('获取采集目标失败:', error)
    }
  }

  const fetchCurrentQuestion = async () => {
    setLoading(true)
    try {
      const response = await collectApi.getCurrentQuestion()
      setCurrentQuestion(response.data)
    } catch (error) {
      console.error('获取当前问题失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      message.warning('请输入回答')
      return
    }
    setSubmitting(true)
    try {
      await collectApi.submitAnswer(currentQuestion!.id, answer)
      setCompletedQuestions(prev => [...prev, { question: currentQuestion!.content, answer }])
      setAnswer('')
      await fetchCurrentQuestion()
      await fetchGoals()
      message.success('回答已提交')
    } catch (error) {
      message.error('提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkipQuestion = async () => {
    if (!currentQuestion) return
    try {
      await collectApi.skipQuestion(currentQuestion.id)
      await fetchCurrentQuestion()
      message.info('已跳过该问题')
    } catch (error) {
      message.error('跳过失败')
    }
  }

  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.reduce((sum, g) => sum + g.total, 0) * 100)
    : 0

  const isAllCompleted = goals.length > 0 && goals.every(g => g.status === 'completed')

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
            <FormOutlined style={{ marginRight: 12 }} />
            知识采集
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
            通过AI引导式问答，系统化地录入企业知识
          </Text>
        </div>

        {/* 整体进度 */}
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: 16,
            marginBottom: 32,
          }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>整体进度</Text>
            <Text style={{ color: '#667eea', fontWeight: 700, fontSize: 18 }}>{totalProgress}%</Text>
          </div>
          <Progress
            percent={totalProgress}
            showInfo={false}
            strokeColor={{
              '0%': '#667eea',
              '100%': '#764ba2',
            }}
            trailColor="rgba(255,255,255,0.1)"
            style={{ marginBottom: 0 }}
          />
        </Card>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* 左侧：目标列表 */}
          <Card
            title={<span style={{ color: '#fff' }}>采集目标</span>}
            style={{
              width: 320,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              flexShrink: 0,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={goals}
              renderItem={(goal) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: currentGoal?.id === goal.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onClick={() => setCurrentGoal(goal)}
                >
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ color: '#fff', fontWeight: 600 }}>{goal.name}</Text>
                      <Tag
                        style={{
                          background: goal.status === 'completed'
                            ? 'rgba(67, 233, 123, 0.2)'
                            : goal.status === 'in_progress'
                            ? 'rgba(102, 126, 234, 0.2)'
                            : 'rgba(255,255,255,0.1)',
                          border: `1px solid ${
                            goal.status === 'completed'
                              ? 'rgba(67, 233, 123, 0.3)'
                              : goal.status === 'in_progress'
                              ? 'rgba(102, 126, 234, 0.3)'
                              : 'rgba(255,255,255,0.15)'
                          }`,
                          color: goal.status === 'completed'
                            ? '#43e97b'
                            : goal.status === 'in_progress'
                            ? '#667eea'
                            : 'rgba(255,255,255,0.5)',
                          borderRadius: 100,
                          fontSize: 11,
                        }}
                      >
                        {goal.status === 'completed' ? '已完成' : goal.status === 'in_progress' ? '进行中' : '待开始'}
                      </Tag>
                    </div>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 8 }}>
                      {goal.description}
                    </Text>
                    <Progress
                      percent={Math.round((goal.progress / goal.total) * 100)}
                      size="small"
                      showInfo={false}
                      strokeColor="#667eea"
                      trailColor="rgba(255,255,255,0.1)"
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 右侧：问答区域 */}
          <Card
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              minWidth: 0,
            }}
            bodyStyle={{ padding: 32 }}
          >
            {isAllCompleted ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <CheckCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
                </div>
                <Title level={3} style={{ color: '#fff', marginBottom: 12 }}>
                  🎉 知识库已可用！
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 }}>
                  共采集 {goals.reduce((sum, g) => sum + g.progress, 0)} 条知识
                </Paragraph>
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 600,
                    }}
                    onClick={() => window.location.href = '/chat'}
                  >
                    问AI试试
                  </Button>
                  <Button
                    size="large"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      color: '#fff',
                      fontWeight: 600,
                    }}
                    onClick={() => window.location.href = '/upload'}
                  >
                    再补点知识
                  </Button>
                </Space>
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.5)' }}>AI正在准备问题...</div>
              </div>
            ) : currentQuestion ? (
              <div>
                <Tag
                  color="#667eea"
                  style={{
                    marginBottom: 24,
                    padding: '6px 16px',
                    borderRadius: 100,
                    fontSize: 13,
                  }}
                >
                  {currentGoal?.name || '知识采集'}
                </Tag>

                <Card
                  style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: 16,
                    marginBottom: 24,
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <RobotOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                    <Title level={4} style={{ color: '#fff', margin: 0, lineHeight: 1.6 }}>
                      {currentQuestion.content}
                    </Title>
                  </div>
                </Card>

                <div style={{ marginBottom: 24 }}>
                  <TextArea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="请输入您的回答..."
                    rows={4}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: '#fff',
                      marginBottom: 16,
                    }}
                  />
                  <Space>
                    <Button
                      type="primary"
                      onClick={handleSubmitAnswer}
                      loading={submitting}
                      disabled={!answer.trim()}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: 10,
                        fontWeight: 600,
                        height: 44,
                        padding: '0 24px',
                      }}
                    >
                      提交回答
                    </Button>
                    <Button
                      icon={<ForwardOutlined />}
                      onClick={handleSkipQuestion}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 10,
                        color: '#fff',
                        height: 44,
                      }}
                    >
                      跳过此题
                    </Button>
                  </Space>
                </div>

                {completedQuestions.length > 0 && (
                  <div>
                    <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
                      已回答的问题 ({completedQuestions.length})
                    </Title>
                    <List
                      dataSource={completedQuestions.slice(-5).reverse()}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            padding: '12px 0',
                          }}
                        >
                          <div>
                            <Text style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                              {item.question}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{item.answer}</Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
                暂无问题
              </div>
            )}
          </Card>
        </div>
      </Card>

      <style>{`
        .ant-input {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #fff !important;
        }
        .ant-input::placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
        .ant-input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
        }
      `}</style>
    </div>
  )
}

export default Collect
