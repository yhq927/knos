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
  Steps,
  Empty,
  Spin,
} from 'antd'
import {
  FormOutlined,
  CheckCircleOutlined,
  RightOutlined,
  SkipOutlined,
  ReloadOutlined,
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
      
      // 找到当前进行中的目标
      const inProgress = response.data.find((g: Goal) => g.status === 'in_progress')
      if (inProgress) {
        setCurrentGoal(inProgress)
      }
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
      
      // 添加到已完成列表
      setCompletedQuestions(prev => [
        ...prev,
        { question: currentQuestion!.content, answer }
      ])

      // 清空输入
      setAnswer('')
      
      // 获取下一个问题
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

  // 计算总进度
  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.reduce((sum, g) => sum + g.total, 0) * 100)
    : 0

  // 判断是否全部完成
  const isAllCompleted = goals.length > 0 && goals.every(g => g.status === 'completed')

  return (
    <div className="page-container fade-in">
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>
            <FormOutlined style={{ marginRight: 8 }} />
            知识采集
          </Title>
          <Text type="secondary">
            通过AI引导式问答，系统化地录入企业知识
          </Text>
        </div>

        {/* 整体进度 */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>整体进度</Text>
            <Text>{totalProgress}%</Text>
          </div>
          <Progress percent={totalProgress} status="active" />
        </Card>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* 左侧：目标列表 */}
          <Card title="采集目标" style={{ width: 300 }}>
            <List
              dataSource={goals}
              renderItem={(goal) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: currentGoal?.id === goal.id ? '#f0fdf4' : 'transparent',
                    padding: '12px',
                    borderRadius: 8,
                  }}
                  onClick={() => setCurrentGoal(goal)}
                >
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong>{goal.name}</Text>
                      <Tag
                        color={
                          goal.status === 'completed'
                            ? 'success'
                            : goal.status === 'in_progress'
                            ? 'processing'
                            : 'default'
                        }
                      >
                        {goal.status === 'completed'
                          ? '已完成'
                          : goal.status === 'in_progress'
                          ? '进行中'
                          : '待开始'}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {goal.description}
                    </Text>
                    <Progress
                      percent={Math.round((goal.progress / goal.total) * 100)}
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 右侧：问答区域 */}
          <Card style={{ flex: 1 }}>
            {isAllCompleted ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
                <Title level={4}>🎉 知识库已可用！</Title>
                <Paragraph type="secondary">
                  共采集 {goals.reduce((sum, g) => sum + g.progress, 0)} 条知识
                </Paragraph>
                <Space>
                  <Button type="primary" onClick={() => window.location.href = '/chat'}>
                    问AI试试
                  </Button>
                  <Button onClick={() => window.location.href = '/upload'}>
                    再补点知识
                  </Button>
                </Space>
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>AI正在准备问题...</div>
              </div>
            ) : currentQuestion ? (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <Tag color="blue">{currentGoal?.name || '知识采集'}</Tag>
                </div>

                <Card style={{ marginBottom: 24, background: '#f0fdf4' }}>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    💬 {currentQuestion.content}
                  </Title>
                </Card>

                <div style={{ marginBottom: 24 }}>
                  <TextArea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="请输入您的回答..."
                    rows={4}
                    style={{ marginBottom: 16 }}
                  />
                  <Space>
                    <Button
                      type="primary"
                      onClick={handleSubmitAnswer}
                      loading={submitting}
                      disabled={!answer.trim()}
                    >
                      提交回答
                    </Button>
                    <Button
                      icon={<SkipOutlined />}
                      onClick={handleSkipQuestion}
                    >
                      跳过此题
                    </Button>
                  </Space>
                </div>

                {/* 已完成的问题 */}
                {completedQuestions.length > 0 && (
                  <div>
                    <Title level={5} style={{ marginBottom: 16 }}>
                      已回答的问题 ({completedQuestions.length})
                    </Title>
                    <List
                      dataSource={completedQuestions.slice(-5).reverse()}
                      renderItem={(item, index) => (
                        <List.Item>
                          <div>
                            <Text strong>{item.question}</Text>
                            <div style={{ marginTop: 4, color: '#666' }}>
                              {item.answer}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Empty description="暂无问题" />
            )}
          </Card>
        </div>
      </Card>
    </div>
  )
}

export default Collect
