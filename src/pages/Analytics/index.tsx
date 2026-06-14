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
  Select,
  Spin,
} from 'antd'
import {
  MessageOutlined,
  BookOutlined,
  UserOutlined,
  RiseOutlined,
  QuestionCircleOutlined,
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

      setOverview(overviewRes.data)
      setHotQuestions(hotRes.data)
      setUncoveredQuestions(uncoveredRes.data)
      setUserRanking(rankingRes.data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 热门问题列定义
  const hotQuestionColumns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: '提问次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: '最后提问',
      dataIndex: 'lastAsked',
      key: 'lastAsked',
      render: (text: string) => new Date(text).toLocaleDateString('zh-CN'),
    },
  ]

  // 未覆盖问题列定义
  const uncoveredQuestionColumns = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: '提问次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="warning">未覆盖</Tag>,
    },
    {
      title: '建议',
      key: 'action',
      render: () => <Text type="secondary">建议补充相关知识</Text>,
    },
  ]

  // 用户排行列定义
  const userRankingColumns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '问答次数',
      dataIndex: 'chatCount',
      key: 'chatCount',
      sorter: (a: any, b: any) => a.chatCount - b.chatCount,
    },
    {
      title: '知识贡献',
      dataIndex: 'knowledgeCount',
      key: 'knowledgeCount',
    },
  ]

  return (
    <div className="page-container fade-in">
      <Card>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>
              数据分析
            </Title>
            <Text type="secondary">查看知识库使用情况和AI问答效果</Text>
          </div>
          <Space>
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
          </Space>
        </div>

        <Spin spinning={loading}>
          {/* 核心指标 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="AI问答次数"
                  value={overview?.aiChatCount || 0}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#0F766E' }}
                  suffix={
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {overview?.aiChatTrend > 0 ? `+${overview.aiChatTrend}%` : ''}
                    </Text>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="知识条目"
                  value={overview?.knowledgeCount || 0}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#0F766E' }}
                  suffix={
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      +{overview?.knowledgeNewCount || 0}
                    </Text>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="活跃用户"
                  value={overview?.activeUsers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#0F766E' }}
                  suffix={
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      日活/月活
                    </Text>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="AI采纳率"
                  value={overview?.adoptionRate || 0}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#10B981' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* 热门问题 */}
            <Col xs={24} lg={12}>
              <Card title={<><QuestionCircleOutlined /> 热门问题 TOP10</>}>
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
              <Card title={<><QuestionCircleOutlined /> 未覆盖问题</>}>
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
          <Card title={<><UserOutlined /> 用户活跃排行</>} style={{ marginTop: 16 }}>
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
