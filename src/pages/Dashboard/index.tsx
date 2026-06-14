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
      setStats(response.data)
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
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate('/chat'),
    },
    {
      icon: <UploadOutlined />,
      title: '上传文档',
      description: '支持多种格式',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => navigate('/upload'),
    },
    {
      icon: <FormOutlined />,
      title: '引导问答',
      description: enterprise?.industry || 'AI引导采集',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: () => navigate('/collect'),
    },
    {
      icon: <BarChartOutlined />,
      title: '数据分析',
      description: '查看使用统计',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      onClick: () => navigate('/analytics'),
    },
  ]

  const recentActivities = [
    { id: '1', action: '上传了文档', user: '张工', time: '5分钟前', target: '亚马逊SOP.docx' },
    { id: '2', action: '完成了引导问答', user: '李姐', time: '1小时前', target: '3个问题' },
    { id: '3', action: '更新了知识条目', user: '王总', time: '2小时前', target: '公司简介' },
  ]

  const knowledgeCount = stats?.knowledgeCount || 0

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* 欢迎区域 */}
      <Card
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 20,
          marginBottom: 24,
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Row align="middle" gutter={24}>
          <Col flex="auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#fff',
                }}
              >
                👋
              </div>
              <div>
                <Title level={4} style={{ color: '#fff', marginBottom: 0 }}>
                  {enterprise?.name || '企业'} 控制台
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
                  欢迎回来，{user?.name || user?.email}
                </Text>
              </div>
            </div>
          </Col>
          <Col>
            <Tag
              color="#667eea"
              style={{
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {enterprise?.planType === 'pro' ? '专业版' : '免费版'}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          {
            title: '知识条目',
            value: stats?.knowledgeCount || 0,
            icon: <BookOutlined />,
            color: '#667eea',
            trend: '+12%',
          },
          {
            title: 'AI问答次数',
            value: stats?.aiChatCount || 0,
            icon: <MessageOutlined />,
            color: '#f093fb',
            trend: '+25%',
          },
          {
            title: '团队成员',
            value: stats?.memberCount || 1,
            icon: <TeamOutlined />,
            color: '#4facfe',
            trend: '',
          },
          {
            title: 'AI采纳率',
            value: stats?.adoptionRate || 0,
            icon: <RiseOutlined />,
            color: '#43e97b',
            suffix: '%',
            trend: '+8%',
          },
        ].map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${stat.color}40 0%, ${stat.color}20 100%)`,
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
                    color="success"
                    style={{
                      background: 'rgba(67, 233, 123, 0.1)',
                      border: '1px solid rgba(67, 233, 123, 0.2)',
                      color: '#43e97b',
                      borderRadius: 100,
                    }}
                  >
                    <ArrowUpOutlined /> {stat.trend}
                  </Tag>
                )}
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                {stat.value}{stat.suffix || ''}
              </div>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{stat.title}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷操作 */}
      <Title level={5} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
        快捷操作
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {quickActions.map((action, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              onClick={action.onClick}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                cursor: 'pointer',
              }}
              bodyStyle={{ padding: 24, textAlign: 'center' }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: action.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  color: '#fff',
                  margin: '0 auto 16px',
                }}
              >
                {action.icon}
              </div>
              <Title level={5} style={{ color: '#fff', marginBottom: 4 }}>
                {action.title}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{action.description}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近活动和知识库状态 */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ color: '#fff' }}>最近活动</span>}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #667eea40 0%, #764ba240 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#667eea',
                          fontSize: 16,
                        }}
                      >
                        {item.user.charAt(0)}
                      </div>
                    }
                    title={
                      <Space>
                        <Text style={{ color: '#fff', fontWeight: 600 }}>{item.user}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{item.action}</Text>
                        <Text style={{ color: '#667eea' }}>{item.target}</Text>
                      </Space>
                    }
                    description={
                      <Text style={{ color: 'rgba(255,255,255,0.3)' }}>{item.time}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ color: '#fff' }}>知识库状态</span>}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              height: '100%',
            }}
            bodyStyle={{ padding: 24, textAlign: 'center' }}
          >
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 8,
                }}
              >
                {knowledgeCount}
              </div>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>知识条目</Text>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: knowledgeCount < 10
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(67, 233, 123, 0.1)',
                border: `1px solid ${knowledgeCount < 10 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(67, 233, 123, 0.2)'}`,
              }}
            >
              <Text
                style={{
                  color: knowledgeCount < 10 ? '#f59e0b' : '#43e97b',
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 10,
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
