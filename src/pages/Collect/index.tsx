import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Progress, List, Tag, Space, Input, message, Spin } from 'antd'
import { motion } from 'framer-motion'
import { FormOutlined, CheckCircleOutlined, ForwardOutlined, RobotOutlined } from '@ant-design/icons'
import { knowledgeApi } from '@/services/api'

const { Title, Text } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const CollectPage: React.FC = () => {
  const [collecting, setCollecting] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [progress, setProgress] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [collectedItems, setCollectedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [industry, setIndustry] = useState('')
  const [step, setStep] = useState<'input' | 'collecting' | 'done'>('input')

  useEffect(() => { fetchCollectedItems() }, [])

  const fetchCollectedItems = async () => {
    setLoading(true)
    try {
      const response = await knowledgeApi.getList({ source: 'ai_collect', pageSize: 50 })
      const result = response.data
      if (result.code === 0) setCollectedItems(result.data.items)
    } catch (error) { console.error('获取采集记录失败:', error) }
    finally { setLoading(false) }
  }

  const handleStartCollect = async () => {
    if (!industry.trim()) { message.warning('请输入行业名称'); return }
    try {
      // Use getCurrentQuestion to start the flow
      const { data: result } = await (await import('@/services/api')).collectApi.getCurrentQuestion()
      if (result.code === 0) {
        setCurrentQuestion(result.data.question || result.data)
        setTotalQuestions(result.data.totalQuestions || 10)
        setProgress(1)
        setCollecting(true)
        setStep('collecting')
      }
    } catch (error) { message.error('启动采集失败') }
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) { message.warning('请输入回答'); return }
    try {
      const { data: result } = await (await import('@/services/api')).collectApi.submitAnswer(currentQuestion?.id, userAnswer)
      if (result.code === 0) {
        if (result.data?.nextQuestion) {
          setCurrentQuestion(result.data.nextQuestion)
          setProgress(result.data.progress || progress + 1)
          setUserAnswer('')
        } else {
          setStep('done'); setCollecting(false)
          message.success('采集完成！')
          fetchCollectedItems()
        }
      }
    } catch (error) { message.error('提交失败') }
  }

  const handleSkip = async () => {
    try {
      const { data: result } = await (await import('@/services/api')).collectApi.skipQuestion(currentQuestion?.id)
      if (result.code === 0) {
        if (result.data?.nextQuestion) { setCurrentQuestion(result.data.nextQuestion); setProgress(result.data.progress || progress + 1) }
        else { setStep('done'); setCollecting(false); fetchCollectedItems() }
      }
    } catch (error) { message.error('跳过失败') }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ ...glass }}>
        <div style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4} style={{ color: '#1e293b', marginBottom: 4, fontWeight: 700 }}>知识采集</Title>
            <Text style={{ color: '#94a3b8' }}>AI引导式问答，快速采集团队经验</Text>
          </div>

          {step === 'input' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '60px 0' }}>
              <motion.div style={{
                width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                boxShadow: '0 12px 32px rgba(102,126,234,0.3)',
              }} animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }}>
                <RobotOutlined style={{ color: '#fff' }} />
              </motion.div>
              <Title level={4} style={{ color: '#1e293b', marginBottom: 8 }}>开始知识采集</Title>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 32 }}>输入您所在的行业，AI将引导您完成知识采集</Text>
              <Input placeholder="请输入行业名称，如：连锁餐饮、金融服务、医疗健康" value={industry}
                onChange={e => setIndustry(e.target.value)} onPressEnter={handleStartCollect}
                style={{ maxWidth: 500, height: 52, borderRadius: 14, fontSize: 15, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
              <div style={{ marginTop: 20 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                  <Button type="primary" size="large" icon={<FormOutlined />} onClick={handleStartCollect}
                    style={{ height: 52, padding: '0 32px', borderRadius: 14, fontWeight: 600, fontSize: 15,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none',
                      boxShadow: '0 8px 24px rgba(102,126,234,0.3)' }}>开始采集</Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 'collecting' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: 24, maxWidth: 600, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: '#64748b', fontSize: 13 }}>采集进度</Text>
                  <Text style={{ color: '#667eea', fontSize: 13, fontWeight: 600 }}>{progress}/{totalQuestions}</Text>
                </div>
                <Progress percent={Math.round((progress / totalQuestions) * 100)} showInfo={false}
                  strokeColor={{ from: '#667eea', to: '#764ba2' }} trailColor="rgba(148,163,184,0.15)" />
              </div>

              <Card style={{ background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16, maxWidth: 600, margin: '0 auto 24px' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}>
                    <RobotOutlined style={{ color: '#fff', fontSize: 18 }} />
                  </div>
                  <div>
                    <Text style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 4 }}>AI 引导</Text>
                    <Text style={{ color: '#1e293b', fontSize: 15, lineHeight: 1.6 }}>{currentQuestion?.question || '正在生成问题...'}</Text>
                  </div>
                </div>
              </Card>

              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <Input.TextArea value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  placeholder="请输入您的回答..." autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.2)', marginBottom: 16 }} />
                <Space>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmitAnswer}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: 10, fontWeight: 600 }}>提交回答</Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button icon={<ForwardOutlined />} onClick={handleSkip}
                      style={{ borderRadius: 10 }}>跳过</Button>
                  </motion.div>
                </Space>
              </div>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '60px 0' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#10b981', marginBottom: 20 }} />
              </motion.div>
              <Title level={4} style={{ color: '#1e293b', marginBottom: 8 }}>采集完成！</Title>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 24 }}>
                本次共采集 {progress} 条知识，已自动入库
              </Text>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                <Button type="primary" onClick={() => { setStep('input'); setProgress(0) }}
                  style={{ height: 48, padding: '0 32px', borderRadius: 14, fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>继续采集</Button>
              </motion.div>
            </motion.div>
          )}

          {collectedItems.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <Title level={5} style={{ color: '#1e293b', marginBottom: 16, fontWeight: 700 }}>最近采集的知识</Title>
              <List dataSource={collectedItems.slice(0, 5)} loading={loading}
                renderItem={(item: any, index: number) => (
                  <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <List.Item style={{ padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                      <List.Item.Meta
                        title={<Text style={{ color: '#1e293b', fontWeight: 600 }}>{item.title}</Text>}
                        description={<Text style={{ color: '#94a3b8' }}>{item.content?.substring(0, 80)}...</Text>}
                      />
                      <Tag style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea', borderRadius: 100 }}>{item.type}</Tag>
                    </List.Item>
                  </motion.div>
                )} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CollectPage
