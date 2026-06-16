import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Table, Tag } from 'antd'
import { motion } from 'framer-motion'
import { ShopOutlined, UserOutlined, BookOutlined, RiseOutlined } from '@ant-design/icons'
import api from '@/services/api'

const { Title, Text } = Typography

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
  boxShadow: '0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      const result = response.data
      if (result.code === 0) setStats(result.data)
    } catch (error) { console.error('获取统计失败:', error) }
    finally { setLoading(false) }
  }

  const statCards = [
    { title: '企业数量', value: stats?.enterpriseCount || 0, icon: <ShopOutlined />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102,126,234,0.3)' },
    { title: '用户数量', value: stats?.userCount || 0, icon: <UserOutlined />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', shadow: 'rgba(245,87,108,0.3)' },
    { title: '知识条目', value: stats?.knowledgeCount || 0, icon: <BookOutlined />, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', shadow: 'rgba(79,172,254,0.3)' },
    { title: '今日活跃', value: stats?.todayActive || 0, icon: <RiseOutlined />, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', shadow: 'rgba(67,233,123,0.3)' },
  ]

  const recentEnterprises = stats?.recentEnterprises || []
  const columns = [
    { title: '企业名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text style={{ color: '#1e293b', fontWeight: 600 }}>{text}</Text> },
    { title: '行业', dataIndex: 'industry', key: 'industry', render: (text: string) => <Tag style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea', borderRadius: 100 }}>{text || '-'}</Tag> },
    { title: '成员数', dataIndex: 'memberCount', key: 'memberCount', render: (count: number) => <Text style={{ color: '#64748b' }}>{count}</Text> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag style={{ background: status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, color: status === 'active' ? '#059669' : '#d97706', borderRadius: 100 }}>{status === 'active' ? '正常' : '待审核'}</Tag> },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ color: '#1e293b', marginBottom: 4, fontWeight: 700 }}>仪表盘</Title>
        <Text style={{ color: '#94a3b8' }}>平台运营数据概览</Text>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08 }}>
              <motion.div whileHover={{ y: -4, boxShadow: `0 12px 32px -6px ${stat.shadow}` }} style={{ ...glass, overflow: 'hidden' }}>
                <div style={{ height: 3, background: stat.gradient }} />
                <div style={{ padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', boxShadow: `0 6px 16px -2px ${stat.shadow}` }}>{stat.icon}</div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#1e293b', lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
                  <Text style={{ color: '#64748b', fontSize: 13 }}>{stat.title}</Text>
                </div>
              </motion.div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <div style={{ ...glass }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
          <Text style={{ color: '#1e293b', fontWeight: 700, fontSize: 15 }}>最近注册企业</Text>
        </div>
        <Table columns={columns} dataSource={recentEnterprises} rowKey="id" loading={loading} pagination={false} style={{ background: 'transparent' }} />
      </div>
    </motion.div>
  )
}

export default AdminDashboard
