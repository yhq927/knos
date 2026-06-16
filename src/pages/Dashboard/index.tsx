import React, { useEffect, useState, useRef } from 'react'
import { Card, Row, Col, Typography, List, Tag, Space, Button, Spin } from 'antd'
import { motion, useInView } from 'framer-motion'
import {
  MessageOutlined, BookOutlined, TeamOutlined, RiseOutlined,
  UploadOutlined, FormOutlined, BarChartOutlined,
  ArrowUpOutlined, RobotOutlined, ThunderboltOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { enterpriseApi } from '@/services/api'

const { Title, Text } = Typography

/* ── Animated counter ── */
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

/* ── Glass card style ── */
const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
  overflow: 'hidden',
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

  const statCards = [
    { title: '知识条目', value: stats?.knowledgeCount || 0, icon: <BookOutlined />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102,126,234,0.3)', trend: '+12%', trendColor: '#059669' },
    { title: 'AI问答次数', value: stats?.aiChatCount || 0, icon: <MessageOutlined />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', shadow: 'rgba(245,87,108,0.3)', trend: '+25%', trendColor: '#059669' },
    { title: '团队成员', value: stats?.memberCount || 1, icon: <TeamOutlined />, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', shadow: 'rgba(79,172,254,0.3)', trend: '', trendColor: '' },
    { title: 'AI采纳率', value: stats?.adoptionRate || 0, icon: <RiseOutlined />, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', shadow: 'rgba(67,233,123,0.3)', trend: '+8%', trendColor: '#059669', suffix: '%' },
  ]

  const quickActions = [
    { icon: <RobotOutlined />, title: 'AI 问答', desc: '50次免费', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', onClick: () => navigate('/chat') },
    { icon: <UploadOutlined />, title: '上传文档', desc: '多格式支持', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', onClick: () => navigate('/upload') },
    { icon: <FormOutlined />, title: '引导采集', desc: 'AI引导', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', onClick: () => navigate('/collect') },
    { icon: <BarChartOutlined />, title: '数据分析', desc: '使用统计', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', onClick: () => navigate('/analytics') },
  ]

  const recentActivities = [
    { id: '1', action: '上传了文档', user: '张工', time: '5分钟前', target: '亚马逊SOP.docx', avatar: '#667eea' },
    { id: '2', action: '完成了引导问答', user: '李姐', time: '1小时前', target: '3个问题', avatar: '#f5576c' },
    { id: '3', action: '更新了知识条目', user: '王总', time: '2小时前', target: '公司简介', avatar: '#4facfe' },
  ]

  const knowledgeCount = stats?.knowledgeCount || 0

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%)',
          borderRadius: 24, padding: '36px 40px', marginBottom: 28, position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 40px -12px rgba(102,126,234,0.3)',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', top: 20, right: 200, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <Row align="middle" gutter={24}>
          <Col flex="auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <motion.div
                style={{ fontSize: 28 }}
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >👋</motion.div>
              <Title level={3} style={{ color: '#fff', marginBottom: 0, fontWeight: 700 }}>
                {enterprise?.name || '企业'} 控制台
              </Title>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
              欢迎回来，{user?.name || user?.email} — 今天又是充满可能的一天
            </Text>
          </Col>
          <Col>
            <Tag style={{
              padding: '6px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600,
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', backdropFilter: 'blur(8px)',
            }}>
              <ThunderboltOutlined /> {enterprise?.planType === 'pro' ? '专业版' : '免费版'}
            </Tag>
          </Col>
        </Row>
      </motion.div>

      {/* ── Stat Cards ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: `0 16px 40px -8px ${stat.shadow}` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={glassCard}
              >
                {/* Gradient top bar */}
                <div style={{ height: 4, background: stat.gradient }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                    <motion.div
                      style={{
                        width: 52, height: 52, borderRadius: 16, background: stat.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, color: '#fff',
                        boxShadow: `0 8px 20px -4px ${stat.shadow}`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >{stat.icon}</motion.div>
                    {stat.trend && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 100,
                        background: 'rgba(16,185,129,0.1)', color: stat.trendColor, fontSize: 12, fontWeight: 600,
                      }}>
                        <ArrowUpOutlined /> {stat.trend}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: '#1e293b', lineHeight: 1, marginBottom: 6 }}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                  </div>
                  <Text style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>{stat.title}</Text>
                </div>
              </motion.div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* ── Quick Actions ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Title level={5} style={{ color: '#475569', marginBottom: 16, fontWeight: 700, fontSize: 15, letterSpacing: '0.5px', textTransform: 'uppercase' }}>快捷操作</Title>
      </motion.div>
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {quickActions.map((action, index) => (
          <Col xs={12} sm={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={action.onClick}
                style={{ ...glassCard, cursor: 'pointer' }}
              >
                <div style={{ padding: 28, textAlign: 'center' }}>
                  <motion.div
                    style={{
                      width: 64, height: 64, borderRadius: 20, background: action.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, color: '#fff', margin: '0 auto 16px',
                      boxShadow: '0 8px 24px -4px rgba(0,0,0,0.15)',
                    }}
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >{action.icon}</motion.div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{action.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{action.desc}</div>
                </div>
              </motion.div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* ── Activity + Knowledge ── */}
      <Row gutter={20}>
        <Col xs={24} lg={14}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <div style={{ ...glassCard }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <Title level={5} style={{ color: '#1e293b', margin: 0, fontWeight: 700 }}>最近活动</Title>
              </div>
              <div style={{ padding: '8px 0' }}>
                {recentActivities.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(99,102,241,0.03)' }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', cursor: 'default' }}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: 14,
                      background: `linear-gradient(135deg, ${item.avatar} 0%, ${item.avatar}88 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 15, fontWeight: 700, flexShrink: 0,
                      boxShadow: `0 4px 12px -2px ${item.avatar}40`,
                    }}>
                      {item.user.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: '#334155' }}>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.user}</span>
                        {' '}{item.action}{' '}
                        <span style={{ color: '#667eea', fontWeight: 500 }}>{item.target}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </Col>

        <Col xs={24} lg={10}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
            <div style={{ ...glassCard, height: '100%' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <Title level={5} style={{ color: '#1e293b', margin: 0, fontWeight: 700 }}>知识库状态</Title>
              </div>
              <div style={{ padding: 32, textAlign: 'center' }}>
                <motion.div
                  style={{
                    fontSize: 72, fontWeight: 900, lineHeight: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: 8,
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.8 }}
                >
                  <AnimatedNumber value={knowledgeCount} />
                </motion.div>
                <Text style={{ color: '#64748b', fontSize: 16, display: 'block', marginBottom: 24 }}>知识条目</Text>

                <motion.div
                  style={{
                    padding: 16, borderRadius: 16,
                    background: knowledgeCount < 10 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    border: `1px solid ${knowledgeCount < 10 ? '#fbbf24' : '#34d399'}`,
                  }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                >
                  <Text style={{ color: knowledgeCount < 10 ? '#92400e' : '#065f46', fontSize: 14, fontWeight: 500 }}>
                    {knowledgeCount < 10 ? '继续采集以完善知识库' : knowledgeCount < 50 ? '知识库已可用，开始AI问答' : '知识库成熟，可对外发布'}
                  </Text>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: 20 }}>
                  <Button type="primary" block style={{
                    height: 48, borderRadius: 14, fontWeight: 600, fontSize: 15,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none', boxShadow: '0 8px 24px -4px rgba(102,126,234,0.4)',
                  }} onClick={() => navigate('/knowledge')}>查看知识库</Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
