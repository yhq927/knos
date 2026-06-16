import React, { useEffect, useState, useRef } from 'react'
import { Card, Row, Col, Statistic, Typography, List, Tag, Space, Button } from 'antd'
import { motion, useInView } from 'framer-motion'
import {
  MessageOutlined, BookOutlined, TeamOutlined, RiseOutlined,
  PlusOutlined, UploadOutlined, FormOutlined, BarChartOutlined,
  ArrowUpOutlined, RobotOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { enterpriseApi } from '@/services/api'

const { Title, Text, Paragraph } = Typography

/* Motion variants */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/* Animated counter */
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = value / 30
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 25)
    return () => clearInterval(timer)
  }, [isInView, value])
  return <span ref={ref}>{display}{suffix}</span>
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { enterprise, user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const response = await enterpriseApi.getStats()
      const result = response.data
      if (result.code === 0) setStats(result.data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { icon: <RobotOutlined />, title: '问AI试试', description: '50次免费AI问答', color: '#2563EB', bg: '#E0E7FF', onClick: () => navigate('/chat') },
    { icon: <UploadOutlined />, title: '上传文档', description: '支持多种格式', color: '#8B5CF6', bg: '#EDE9FE', onClick: () => navigate('/upload') },
    { icon: <FormOutlined />, title: '引导问答', description: enterprise?.industry || 'AI引导采集', color: '#0EA5E9', bg: '#E0F2FE', onClick: () => navigate('/collect') },
    { icon: <BarChartOutlined />, title: '数据分析', description: '查看使用统计', color: '#10B981', bg: '#D1FAE5', onClick: () => navigate('/analytics') },
  ]

  const recentActivities = [
    { id: '1', action: '上传了文档', user: '张工', time: '5分钟前', target: '亚马逊SOP.docx' },
    { id: '2', action: '完成了引导问答', user: '李姐', time: '1小时前', target: '3个问题' },
    { id: '3', action: '更新了知识条目', user: '王总', time: '2小时前', target: '公司简介' },
  ]

  const knowledgeCount = stats?.knowledgeCount || 0

  const statCards = [
    { title: '知识条目', value: stats?.knowledgeCount || 0, icon: <BookOutlined />, color: '#2563EB', bg: '#E0E7FF', trend: '+12%' },
    { title: 'AI问答次数', value: stats?.aiChatCount || 0, icon: <MessageOutlined />, color: '#8B5CF6', bg: '#EDE9FE', trend: '+25%' },
    { title: '团队成员', value: stats?.memberCount || 1, icon: <TeamOutlined />, color: '#0EA5E9', bg: '#E0F2FE', trend: '' },
    { title: 'AI采纳率', value: stats?.adoptionRate || 0, icon: <RiseOutlined />, color: '#10B981', bg: '#D1FAE5', suffix: '%', trend: '+8%' },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card style={{
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(229,231,235,0.5)', borderRadius: 20,
          marginBottom: 24, boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden', position: 'relative',
        }} styles={{ body: { padding: 32 } }}>
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 6,
              background: 'linear-gradient(180deg, #2563EB 0%, #60A5FA 100%)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Row align="middle" gutter={24}>
            <Col flex="auto">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <motion.div
                  style={{
                    width: 52, height: 52, borderRadius: 16, background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >👋</motion.div>
                <div>
                  <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: 0, fontWeight: 700 }}>
                    {enterprise?.name || '企业'} 控制台
                  </Title>
                  <Text style={{ color: 'var(--text-muted)' }}>
                    欢迎回来，{user?.name || user?.email}
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <Tag style={{
                padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                background: 'var(--primary-light)', border: '1px solid rgba(196,181,253,0.3)', color: 'var(--primary)',
              }}>
                {enterprise?.planType === 'pro' ? '专业版' : '免费版'}
              </Tag>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger} initial="hidden" animate="visible">
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div variants={fadeUp} custom={index}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 12px 28px -4px ${stat.color}22` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Card style={{
                    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(196,210,240,0.5)', borderRadius: 20,
                    boxShadow: '0 4px 16px -2px rgba(37,99,235,0.06), inset 0 0 0 1px rgba(255,255,255,0.5)',
                  }} styles={{ body: { padding: 24 } }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <motion.div
                        style={{
                          width: 48, height: 48, borderRadius: 14, background: stat.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22, color: stat.color,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >{stat.icon}</motion.div>
                      {stat.trend && (
                        <Tag style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#059669', borderRadius: 100 }}>
                          <ArrowUpOutlined /> {stat.trend}
                        </Tag>
                      )}
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                      <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                    </div>
                    <Text style={{ color: 'var(--text-muted)', fontSize: 14 }}>{stat.title}</Text>
                  </Card>
                </motion.div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Title level={5} style={{ color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 700 }}>快捷操作</Title>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" animate="visible">
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div variants={fadeUp} custom={index}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 16px 32px -8px rgba(37,99,235,0.12)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={action.onClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Card style={{
                    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(196,210,240,0.5)', borderRadius: 20,
                    boxShadow: '0 4px 16px -2px rgba(37,99,235,0.06), inset 0 0 0 1px rgba(255,255,255,0.5)',
                  }} styles={{ body: { padding: 24, textAlign: 'center' } }}>
                    <motion.div
                      style={{
                        width: 64, height: 64, borderRadius: 18, background: action.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, color: action.color, margin: '0 auto 16px',
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >{action.icon}</motion.div>
                    <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 4, fontWeight: 600 }}>{action.title}</Title>
                    <Text style={{ color: 'var(--text-muted)' }}>{action.description}</Text>
                  </Card>
                </motion.div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Activity + Knowledge */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card
              title={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>最近活动</span>}
              style={{
                background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(229,231,235,0.5)', borderRadius: 20,
                boxShadow: 'var(--shadow-sm)',
              }}
              styles={{ body: { padding: 0 } }}
            >
              <List
                dataSource={recentActivities}
                renderItem={(item, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <List.Item style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
                      <List.Item.Meta
                        avatar={
                          <motion.div
                            style={{
                              width: 40, height: 40, borderRadius: 12, background: '#E0E7FF',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#2563EB', fontSize: 16, fontWeight: 600,
                            }}
                            whileHover={{ scale: 1.1 }}
                          >{item.user.charAt(0)}</motion.div>
                        }
                        title={
                          <Space>
                            <Text style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.user}</Text>
                            <Text style={{ color: 'var(--text-muted)' }}>{item.action}</Text>
                            <Text style={{ color: 'var(--primary)' }}>{item.target}</Text>
                          </Space>
                        }
                        description={<Text style={{ color: 'var(--text-muted)' }}>{item.time}</Text>}
                      />
                    </List.Item>
                  </motion.div>
                )}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <Card
              title={<span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>知识库状态</span>}
              style={{
                background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(229,231,235,0.5)', borderRadius: 20,
                height: '100%', boxShadow: 'var(--shadow-sm)',
              }}
              styles={{ body: { padding: 24, textAlign: 'center' } }}
            >
              <div style={{ marginBottom: 24 }}>
                <motion.div
                  style={{
                    fontSize: 64, fontWeight: 900,
                    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: 8,
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
                >
                  <AnimatedNumber value={knowledgeCount} />
                </motion.div>
                <Text style={{ color: 'var(--text-muted)', fontSize: 16 }}>知识条目</Text>
              </div>

              <motion.div
                style={{
                  padding: 16, borderRadius: 14,
                  background: knowledgeCount < 10 ? '#FEF3C7' : '#D1FAE5',
                  border: `1px solid ${knowledgeCount < 10 ? '#FDE68A' : '#A7F3D0'}`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Text style={{ color: knowledgeCount < 10 ? '#D97706' : '#059669', fontSize: 14 }}>
                  {knowledgeCount < 10
                    ? '继续采集以完善知识库'
                    : knowledgeCount < 50
                    ? '知识库已可用，可以开始AI问答'
                    : '知识库成熟，可以对外发布'}
                </Text>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: 16 }}>
                <Button type="primary" block style={{
                  height: 44, background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  border: 'none', borderRadius: 12, fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                }} onClick={() => navigate('/knowledge')}>查看知识库</Button>
              </motion.div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
