import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Table, Tag, Button } from 'antd'
import {
  ShopOutlined,
  UserOutlined,
  BookOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [recentEnterprises, setRecentEnterprises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // 获取统计数据
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      if (statsData.code === 0) {
        setStats(statsData.data)
      }

      // 获取最近企业
      const enterprisesRes = await fetch('/api/admin/enterprises?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const enterprisesData = await enterprisesRes.json()
      if (enterprisesData.code === 0) {
        setRecentEnterprises(enterprisesData.data.list)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const enterpriseColumns = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text style={{ color: '#fff' }}>{text}</Text>
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '套餐',
      dataIndex: 'planType',
      key: 'planType',
      render: (type: string) => (
        <Tag color={type === 'pro' ? 'gold' : type === 'enterprise' ? 'purple' : 'default'}>
          {type === 'pro' ? '专业版' : type === 'enterprise' ? '企业版' : '免费版'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString('zh-CN')
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#fff', marginBottom: 4 }}>仪表盘</Title>
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>平台运营数据概览</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {[
          { title: '总企业数', value: stats?.totalEnterprises || 0, icon: <ShopOutlined />, color: '#667eea' },
          { title: '总用户数', value: stats?.totalUsers || 0, icon: <UserOutlined />, color: '#4facfe' },
          { title: '总知识条目', value: stats?.totalKnowledge || 0, icon: <BookOutlined />, color: '#43e97b' },
          { title: '今日活跃', value: stats?.dailyActive || 0, icon: <RiseOutlined />, color: '#f59e0b' },
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{item.title}</Text>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginTop: 8 }}>
                    {item.value}
                  </div>
                </div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${item.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: item.color
                }}>
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近企业 */}
      <Card
        title={<span style={{ color: '#fff' }}>最近注册企业</span>}
        extra={
          <Button
            type="link"
            onClick={() => navigate('/admin/enterprises')}
            style={{ color: '#667eea' }}
          >
            查看全部
          </Button>
        }
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16
        }}
      >
        <Table
          columns={enterpriseColumns}
          dataSource={recentEnterprises}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
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
      `}</style>
    </div>
  )
}

export default AdminDashboard
