import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  Space,
  DatePicker,
  Spin,
} from 'antd'
import {
  MessageOutlined,
  BookOutlined,
  UserOutlined,
  RiseOutlined,
  QuestionCircleOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { analyticsApi } from '@/services/api'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [overview, setOverview] = useState<any>(null)
  const [hotQuestions, setHotQuestions] = useState<any[]>([])
  const [uncoveredQuestions, setUncoveredQuestions] = useState<any[]>([])
  const [userRanking, setUserRanking] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = dateRange ? { startDate: dateRange[0], endDate: dateRange[1] } : {}
      const [overviewRes, hotRes, uncoveredRes, rankingRes] = await Promise.all([
        analyticsApi.getOverview(params),
        analyticsApi.getHotQuestions(10),
        analyticsApi.getUncoveredQuestions(10),
        analyticsApi.getUserRanking(10),
      ])

      const overviewResult = overviewRes.data
      const hotResult = hotRes.data
      const uncoveredResult = uncoveredRes.data
      const rankingResult = rankingRes.data

      if (overviewResult.code === 0) setOverview(overviewResult.data)
      if (hotResult.code === 0) setHotQuestions(hotResult.data)
      if (uncoveredResult.code === 0) setUncoveredQuestions(uncoveredResult.data)
      if (rankingResult.code === 0) setUserRanking(rankingResult.data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const hotQuestionColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Tag
          style={{
            background: index < 3 ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' : '#F3F4F6',
            border: 'none',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          {index + 1}
        </Tag>
      ),
    },
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      render: (text: string) => <Text style={{ color: '#111827' }}>{text}</Text>,
    },
    {
      title: '提问次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => <Text style={{ color: '#2563EB', fontWeight: 600 }}>{count}</Text>,
    },
    {
      title: '最后提问',
      dataIndex: 'lastAsked',
      key: 'lastAsked',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{new Date(text).toLocaleDateString('zh-CN')}</Text>,
    },
  ]

  const uncoveredQuestionColumns = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      render: (text: string) => <Text style={{ color: '#111827' }}>{text}</Text>,
    },
    {
      title: '提问次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => <Text style={{ color: '#D97706', fontWeight: 600 }}>{count}</Text>,
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag
          style={{
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            color: '#D97706',
            borderRadius: 100,
          }}
        >
          未覆盖
        </Tag>
      ),
    },
    {
      title: '建议',
      key: 'action',
      render: () => <Text style={{ color: '#9CA3AF' }}>建议补充相关知识</Text>,
    },
  ]

  const userRankingColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Tag
          style={{
            background: index < 3 ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' : '#F3F4F6',
            border: 'none',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          {index + 1}
        </Tag>
      ),
    },
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {text.charAt(0)}
          </div>
          <Text style={{ color: '#111827' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '问答次数',
      dataIndex: 'chatCount',
      key: 'chatCount',
      sorter: (a: any, b: any) => a.chatCount - b.chatCount,
      render: (count: number) => <Text style={{ color: '#2563EB', fontWeight: 600 }}>{count}</Text>,
    },
    {
      title: '知识贡献',
      dataIndex: 'knowledgeCount',
      key: 'knowledgeCount',
      render: (count: number) => <Text style={{ color: '#059669', fontWeight: 600 }}>{count}</Text>,
    },
  ]

  const statCards = [
    { title: 'AI问答次数', value: overview?.aiChatCount || 0, icon: <MessageOutlined />, color: '#2563EB', bg: '#E0E7FF', trend: '+25%' },
    { title: '知识条目', value: overview?.knowledgeCount || 0, icon: <BookOutlined />, color: '#8B5CF6', bg: '#EDE9FE', trend: '+12%' },
    { title: '活跃用户', value: overview?.activeUsers || 0, icon: <UserOutlined />, color: '#0EA5E9', bg: '#E0F2FE', trend: '' },
    { title: 'AI采纳率', value: overview?.adoptionRate || 0, icon: <RiseOutlined />, color: '#10B981', bg: '#D1FAE5', suffix: '%', trend: '+8%' },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
              <BarChartOutlined style={{ marginRight: 12 }} />
              数据分析
            </Title>
            <Text style={{ color: '#6B7280', fontSize: 16 }}>
              查看知识库使用情况和AI问答效果
            </Text>
          </div>
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setDateRange([
                  dates[0]!.format('YYYY-MM-DD'),
                  dates[1]!.format('YYYY-MM-DD'),
                ])
              } else {
                setDateRange(null)
              }
            }}
          />
        </div>

        <Spin spinning={loading}>
          {/* 核心指标 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
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

          <Row gutter={[16, 16]}>
            {/* 热门问题 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <QuestionCircleOutlined style={{ color: '#2563EB' }} />
                    <span style={{ color: '#111827', fontWeight: 600 }}>热门问题 TOP10</span>
                  </Space>
                }
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                styles={{ body: { padding: 0 } }}
              >
                <Table
                  columns={hotQuestionColumns}
                  dataSource={hotQuestions}
                  rowKey="question"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            {/* 未覆盖问题 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <QuestionCircleOutlined style={{ color: '#D97706' }} />
                    <span style={{ color: '#111827', fontWeight: 600 }}>未覆盖问题</span>
                  </Space>
                }
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                styles={{ body: { padding: 0 } }}
              >
                <Table
                  columns={uncoveredQuestionColumns}
                  dataSource={uncoveredQuestions}
                  rowKey="question"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          {/* 用户排行 */}
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#2563EB' }} />
                <span style={{ color: '#111827', fontWeight: 600 }}>用户活跃排行</span>
              </Space>
            }
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              marginTop: 16,
            }}
            styles={{ body: { padding: 0 } }}
          >
            <Table
              columns={userRankingColumns}
              dataSource={userRanking}
              rowKey="userId"
              pagination={false}
            />
          </Card>
        </Spin>
      </Card>
    </div>
  )
}

export default Analytics
