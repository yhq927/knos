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
            background: index < 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
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
      render: (text: string) => <Text style={{ color: '#fff' }}>{text}</Text>,
    },
    {
      title: '提问次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => <Text style={{ color: '#667eea', fontWeight: 600 }}>{count}</Text>,
    },
    {
      title: '最后提问',
      dataIndex: 'lastAsked',
      key: 'lastAsked',
      render: (text: string) => <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(text).toLocaleDateString('zh-CN')}</Text>,
    },
  ]

  const uncoveredQuestionColumns = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      render: (text: string) => <Text style={{ color: '#fff' }}>{text}</Text>,
    },
    {
      title: '提问次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => <Text style={{ color: '#f59e0b', fontWeight: 600 }}>{count}</Text>,
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag
          style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
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
      render: () => <Text style={{ color: 'rgba(255,255,255,0.4)' }}>建议补充相关知识</Text>,
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
            background: index < 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <Text style={{ color: '#fff' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '问答次数',
      dataIndex: 'chatCount',
      key: 'chatCount',
      sorter: (a: any, b: any) => a.chatCount - b.chatCount,
      render: (count: number) => <Text style={{ color: '#667eea', fontWeight: 600 }}>{count}</Text>,
    },
    {
      title: '知识贡献',
      dataIndex: 'knowledgeCount',
      key: 'knowledgeCount',
      render: (count: number) => <Text style={{ color: '#43e97b', fontWeight: 600 }}>{count}</Text>,
    },
  ]

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
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
              <BarChartOutlined style={{ marginRight: 12 }} />
              数据分析
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
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
            {[
              {
                title: 'AI问答次数',
                value: overview?.aiChatCount || 0,
                icon: <MessageOutlined />,
                color: '#667eea',
                trend: '+25%',
              },
              {
                title: '知识条目',
                value: overview?.knowledgeCount || 0,
                icon: <BookOutlined />,
                color: '#f093fb',
                trend: '+12%',
              },
              {
                title: '活跃用户',
                value: overview?.activeUsers || 0,
                icon: <UserOutlined />,
                color: '#4facfe',
                trend: '',
              },
              {
                title: 'AI采纳率',
                value: overview?.adoptionRate || 0,
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

          <Row gutter={[16, 16]}>
            {/* 热门问题 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <QuestionCircleOutlined style={{ color: '#667eea' }} />
                    <span style={{ color: '#fff' }}>热门问题 TOP10</span>
                  </Space>
                }
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                }}
                bodyStyle={{ padding: 0 }}
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
                    <QuestionCircleOutlined style={{ color: '#f59e0b' }} />
                    <span style={{ color: '#fff' }}>未覆盖问题</span>
                  </Space>
                }
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                }}
                bodyStyle={{ padding: 0 }}
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
                <UserOutlined style={{ color: '#667eea' }} />
                <span style={{ color: '#fff' }}>用户活跃排行</span>
              </Space>
            }
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              marginTop: 16,
            }}
            bodyStyle={{ padding: 0 }}
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

      <style>{`
        .ant-table {
          background: transparent !important;
        }
        .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.05) !important;
          color: rgba(255,255,255,0.8) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .ant-table-tbody > tr > td {
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(102, 126, 234, 0.1) !important;
        }
        .ant-picker {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .ant-picker-input > input {
          color: #fff !important;
        }
        .ant-picker-input > input::placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
        .ant-picker-suffix {
          color: rgba(255,255,255,0.3) !important;
        }
      `}</style>
    </div>
  )
}

export default Analytics
