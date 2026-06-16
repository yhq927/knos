import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Table, Tag, DatePicker } from 'antd'
import { motion } from 'framer-motion'
import { MessageOutlined, BookOutlined, UserOutlined, RiseOutlined, QuestionCircleOutlined, ArrowUpOutlined, BarChartOutlined } from '@ant-design/icons'
import { analyticsApi } from '@/services/api'

const { Title, Text } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsApi.getOverview()
      const result = response.data
      if (result.code === 0) setStats(result.data)
    } catch (error) { console.error('获取分析数据失败:', error) }
    finally { setLoading(false) }
  }

  const statCards = [
    { title: '总问答次数', value: stats?.totalChats || 0, icon: <MessageOutlined />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102,126,234,0.3)', trend: '+18%' },
    { title: '知识条目', value: stats?.totalKnowledge || 0, icon: <BookOutlined />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', shadow: 'rgba(245,87,108,0.3)', trend: '+12%' },
    { title: '活跃用户', value: stats?.activeUsers || 0, icon: <UserOutlined />, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', shadow: 'rgba(79,172,254,0.3)', trend: '+25%' },
    { title: '采纳率', value: stats?.adoptionRate || 0, icon: <RiseOutlined />, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', shadow: 'rgba(67,233,123,0.3)', suffix: '%', trend: '+8%' },
  ]

  const topQuestions = stats?.topQuestions || []
  const columns = [
    { title: '问题', dataIndex: 'question', key: 'question', render: (text: string) => <Text style={{ color: '#1e293b', fontWeight: 500 }}>{text}</Text> },
    { title: '提问次数', dataIndex: 'count', key: 'count', render: (count: number) => <Text style={{ color: '#667eea', fontWeight: 600 }}>{count}</Text> },
    { title: '采纳率', dataIndex: 'adoptionRate', key: 'adoptionRate', render: (rate: number) => <Text style={{ color: rate > 80 ? '#059669' : rate > 50 ? '#d97706' : '#dc2626', fontWeight: 600 }}>{rate}%</Text> },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ ...glass }}>
        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <Title level={4} style={{ color: '#1e293b', marginBottom: 4, fontWeight: 700 }}>数据分析</Title>
              <Text style={{ color: '#94a3b8' }}>查看使用统计和知识库效果</Text>
            </div>
            <DatePicker.RangePicker style={{ borderRadius: 10, background: 'rgba(248,250,252,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} />
          </div>

          <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
            {statCards.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08 }}>
                  <motion.div whileHover={{ y: -4 }} style={{
                    background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(37,99,235,0.04)',
                  }}>
                    <div style={{ height: 3, background: stat.gradient }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', boxShadow: `0 6px 16px -2px ${stat.shadow}` }}>{stat.icon}</div>
                        {stat.trend && <Tag style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669', borderRadius: 100, fontSize: 11 }}><ArrowUpOutlined /> {stat.trend}</Tag>}
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', lineHeight: 1, marginBottom: 4 }}>{stat.value}{stat.suffix || ''}</div>
                      <Text style={{ color: '#64748b', fontSize: 13 }}>{stat.title}</Text>
                    </div>
                  </motion.div>
                </motion.div>
              </Col>
            ))}
          </Row>

          <Row gutter={20}>
            <Col xs={24} lg={16}>
              <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.5)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#1e293b', fontWeight: 700, fontSize: 15 }}><QuestionCircleOutlined style={{ marginRight: 8, color: '#667eea' }} />高频问题</Text>
                  <Tag style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea', borderRadius: 100 }}>TOP {topQuestions.length}</Tag>
                </div>
                <Table columns={columns} dataSource={topQuestions} rowKey="question" pagination={false} loading={loading} style={{ background: 'transparent' }} />
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.5)', overflow: 'hidden', height: '100%' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <Text style={{ color: '#1e293b', fontWeight: 700, fontSize: 15 }}><BarChartOutlined style={{ marginRight: 8, color: '#667eea' }} />知识来源分布</Text>
                </div>
                <div style={{ padding: 20 }}>
                  {[
                    { name: 'AI采集', percent: 45, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                    { name: '文档上传', percent: 30, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                    { name: '手动录入', percent: 15, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
                    { name: '行业知识', percent: 10, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{item.name}</Text>
                        <Text style={{ color: '#1e293b', fontSize: 13, fontWeight: 700 }}>{item.percent}%</Text>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${item.percent}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: '100%', borderRadius: 4, background: item.gradient }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics
