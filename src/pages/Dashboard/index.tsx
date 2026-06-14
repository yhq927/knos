import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Typography, List, Tag, Space, Button, Empty } from 'antd'
import {
  MessageOutlined,
  BookOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  UploadOutlined,
  FormOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { enterpriseApi } from '@/services/api'

const { Title, Text } = Typography

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

  // 快捷操作
  const quickActions = [
    {
      icon: <MessageOutlined style={{ fontSize: 24, color: '#0F766E' }} />,
      title: '问AI试试',
      description: '50次免费AI问答',
      onClick: () => navigate('/chat'),
    },
    {
      icon: <UploadOutlined style={{ fontSize: 24, color: '#0F766E' }} />,
      title: '上传文档',
      description: '20MB/单文件',
      onClick: () => navigate('/upload'),
    },
    {
      icon: <FormOutlined style={{ fontSize: 24, color: '#0F766E' }} />,
      title: '引导问答',
      description: enterprise?.industry || '专属目标体系',
      onClick: () => navigate('/collect'),
    },
    {
      icon: <BookOutlined style={{ fontSize: 24, color: '#0F766E' }} />,
      title: '知识库',
      description: '查看所有知识',
      onClick: () => navigate('/knowledge'),
    },
  ]

  // 模拟最近活动
  const recentActivities = [
    { id: '1', action: '上传了文档', user: '张工', time: '5分钟前', target: '亚马逊SOP.docx' },
    { id: '2', action: '完成了引导问答', user: '李姐', time: '1小时前', target: '3个问题' },
    { id: '3', action: '更新了知识条目', user: '王总', time: '2小时前', target: '公司简介' },
  ]

  // 判断空状态
  const knowledgeCount = stats?.knowledgeCount || 0
  const isEmpty = knowledgeCount === 0
  const isStarting = knowledgeCount > 0 && knowledgeCount < 10

  return (
    <div className="page-container fade-in">
      {/* 欢迎区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" gutter={24}>
          <Col flex="auto">
            <Title level={4} style={{ marginBottom: 4 }}>
              {isEmpty
                ? `👋 欢迎来到 KnosAI，${enterprise?.name || '企业'}`
                : `📊 ${enterprise?.name || '企业'} 概览`}
            </Title>
            <Text type="secondary">
              {isEmpty
                ? '让我们用 5 分钟搭好你的知识库'
                : `行业：${enterprise?.industry || '未设置'} | 知识条目：${knowledgeCount} 条`}
            </Text>
          </Col>
          <Col>
            <Tag color="blue">{enterprise?.planType === 'pro' ? '专业版' : '免费版'}</Tag>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="知识条目"
              value={stats?.knowledgeCount || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#0F766E' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="AI问答次数"
              value={stats?.aiChatCount || 0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#0F766E' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={stats?.memberCount || 1}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#0F766E' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="AI采纳率"
              value={stats?.adoptionRate || 0}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Title level={5} style={{ marginBottom: 16 }}>快捷操作</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {quickActions.map((action, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              onClick={action.onClick}
              style={{ textAlign: 'center' }}
            >
              <div style={{ marginBottom: 12 }}>{action.icon}</div>
              <Title level={5} style={{ marginBottom: 4 }}>{action.title}</Title>
              <Text type="secondary">{action.description}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近活动 */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="最近活动">
            {recentActivities.length > 0 ? (
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.user}</Text>
                          <Text type="secondary">{item.action}</Text>
                          <Text>{item.target}</Text>
                        </Space>
                      }
                      description={item.time}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无活动记录" />
            )}
          </Card>
        </Col>

        {/* 空状态引导 */}
        {isEmpty && (
          <Col xs={24} lg={8}>
            <Card title="快速开始">
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                  💡 引导问答的目标已根据行业预设好了
                </Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/collect')}
                  block
                >
                  开始采集
                </Button>
              </div>
            </Card>
          </Col>
        )}

        {!isEmpty && (
          <Col xs={24} lg={8}>
            <Card title="知识库状态">
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#0F766E' }}>
                  {knowledgeCount}
                </div>
                <Text type="secondary">知识条目</Text>
                <div style={{ marginTop: 16 }}>
                  {knowledgeCount < 10 && (
                    <Text type="warning">继续采集以完善知识库</Text>
                  )}
                  {knowledgeCount >= 10 && knowledgeCount < 50 && (
                    <Text type="success">知识库已可用，可以开始AI问答</Text>
                  )}
                  {knowledgeCount >= 50 && (
                    <Text type="success">知识库成熟，可以对外发布</Text>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Dashboard
