import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Typography, List, Tag, Space, Button } from 'antd'
import {
  MessageOutlined,
  BookOutlined,
  TeamOutlined,
  RiseOutlined,
  PlusOutlined,
  UploadOutlined,
  FormOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { enterpriseApi } from '@/services/api'

const { Title, Text, Paragraph } = Typography

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { enterprise, user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await enterpriseApi.getStats()
      const result = response.data
      if (result.code === 0) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      icon: <RobotOutlined />,
      title: '问AI试试',
      description: '50次免费AI问答',
      color: '#2563EB',
      bg: '#E0E7FF',
      onClick: () => navigate('/chat'),
    },
    {
      icon: <UploadOutlined />,
      title: '上传文档',
      description: '支持多种格式',
      color: '#8B5CF6',
      bg: '#EDE9FE',
      onClick: () => navigate('/upload'),
    },
    {
      icon: <FormOutlined />,
      title: '引导问答',
      description: enterprise?.industry || 'AI引导采集',
      color: '#0EA5E9',
      bg: '#E0F2FE',
      onClick: () => navigate('/collect'),
    },
    {
      icon: <BarChartOutlined />,
      title: '数据分析',
      description: '查看使用统计',
      color: '#10B981',
      bg: '#D1FAE5',
      onClick: () => navigate('/analytics'),
    },
  ]

  const recentActivities = [
    { id: '1', action: '上传了文档', user: '张工', time: '5分钟前', target: '亚马逊SOP.docx' },
    { id: '2', action: '完成了引导问答', user: '李姐', time: '1小时前', target: '3个问题' },
    { id: '3', action: '更新了知识条目', user: '王总', time: '2小时前', target: '公司简介' },
  ]

  const knowledgeCount = stats?.knowledgeCount || 0

  const statCards = [
    {
      title: '知识条目',
      value: stats?.knowledgeCount || 0,
      icon: <BookOutlined />,
      color: '#2563EB',
      bg: '#E0E7FF',
      trend: '+12%',
    },
    {
      title: 'AI问答次数',
      value: stats?.aiChatCount || 0,
      icon: <MessageOutlined />,
      color: '#8B5CF6',
      bg: '#EDE9FE',
      trend: '+25%',
    },
    {
      title: '团队成员',
      value: stats?.memberCount || 1,
      icon: <TeamOutlined />,
      color: '#0EA5E9',
      bg: '#E0F2FE',
      trend: '',
    },
    {
      title: 'AI采纳率',
      value: stats?.adoptionRate || 0,
      icon: <RiseOutlined />,
      color: '#10B981',
      bg: '#D1FAE5',
      suffix: '%',
      trend: '+8%',
    },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* 欢迎区域 */}
      <Card
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          marginBottom: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          position: 'relative',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 6,
          background: 'linear-gradient(180deg, #2563EB 0%, #3B82F6 100%)',
        }} />
        <Row align="middle" gutter={24}>
          <Col flex="auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: '#E0E7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                👋
              </div>
              <div>
                <Title level={4} style={{ color: '#111827', marginBottom: 0, fontWeight: 700 }}>
                  {enterprise?.name || '企业'} 控制台
                </Title>
                <Text style={{ color: '#6B7280' }}>
                  欢迎回来，{user?.name || user?.email}
                </Text>
              </div>
            </div>
          </Col>
          <Col>
            <Tag
              style={{
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                background: '#E0E7FF',
                border: '1px solid #C7D2FE',
                color: '#2563EB',
              }}
            >
              {enterprise?.planType === 'pro' ? '专业版' : '免费版'}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                {stat.trend && (
                  <Tag
                    style={{
                      background: '#D1FAE5',
                      border: '1px solid #A7F3D0',
                      color: '#059669',
                      borderRadius: 100,
                    }}
                  >
                    <ArrowUpOutlined /> {stat.trend}
                  </Tag>
                )}
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                {stat.value}{stat.suffix || ''}
              </div>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>{stat.title}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷操作 */}
      <Title level={5} style={{ color: '#374151', marginBottom: 16, fontWeight: 700 }}>
        快捷操作
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {quickActions.map((action, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              onClick={action.onClick}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
              }}
              styles={{ body: { padding: 24, textAlign: 'center' } }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: action.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  color: action.color,
                  margin: '0 auto 16px',
                }}
              >
                {action.icon}
              </div>
              <Title level={5} style={{ color: '#111827', marginBottom: 4, fontWeight: 600 }}>
                {action.title}
              </Title>
              <Text style={{ color: '#6B7280' }}>{action.description}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近活动和知识库状态 */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ color: '#111827', fontWeight: 600 }}>最近活动</span>}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            styles={{ body: { padding: 0 } }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: '#E0E7FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563EB',
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {item.user.charAt(0)}
                      </div>
                    }
                    title={
                      <Space>
                        <Text style={{ color: '#111827', fontWeight: 600 }}>{item.user}</Text>
                        <Text style={{ color: '#6B7280' }}>{item.action}</Text>
                        <Text style={{ color: '#2563EB' }}>{item.target}</Text>
                      </Space>
                    }
                    description={
                      <Text style={{ color: '#9CA3AF' }}>{item.time}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ color: '#111827', fontWeight: 600 }}>知识库状态</span>}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              height: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            styles={{ body: { padding: 24, textAlign: 'center' } }}
          >
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 8,
                }}
              >
                {knowledgeCount}
              </div>
              <Text style={{ color: '#6B7280', fontSize: 16 }}>知识条目</Text>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: knowledgeCount < 10
                  ? '#FEF3C7'
                  : '#D1FAE5',
                border: `1px solid ${knowledgeCount < 10 ? '#FDE68A' : '#A7F3D0'}`,
              }}
            >
              <Text
                style={{
                  color: knowledgeCount < 10 ? '#D97706' : '#059669',
                  fontSize: 14,
                }}
              >
                {knowledgeCount < 10
                  ? '继续采集以完善知识库'
                  : knowledgeCount < 50
                  ? '知识库已可用，可以开始AI问答'
                  : '知识库成熟，可以对外发布'}
              </Text>
            </div>

            <Button
              type="primary"
              block
              style={{
                marginTop: 16,
                height: 44,
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
              }}
              onClick={() => navigate('/knowledge')}
            >
              查看知识库
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
