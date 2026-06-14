import React from 'react'
import { Button, Card, Row, Col, Typography, Space, Layout } from 'antd'
import {
  RobotOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography
const { Header, Content, Footer } = Layout

const Home: React.FC = () => {
  const navigate = useNavigate()

  // 功能特性
  const features = [
    {
      icon: <RobotOutlined style={{ fontSize: 48, color: '#0F766E' }} />,
      title: '智能知识采集',
      description: 'AI引导式问答，10分钟完成首次知识沉淀',
    },
    {
      icon: <CloudUploadOutlined style={{ fontSize: 48, color: '#0F766E' }} />,
      title: 'AI智能问答',
      description: '基于企业知识库的精准回答，附带来源标注',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 48, color: '#0F766E' }} />,
      title: '私有化部署',
      description: '支持自定义API Key，数据完全私有',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 48, color: '#0F766E' }} />,
      title: '对外服务能力',
      description: '将知识库转化为客户服务工具',
    },
  ]

  // 使用步骤
  const steps = [
    { number: '1', title: '注册企业', description: '1分钟完成注册' },
    { number: '2', title: '选择行业', description: '加载行业知识库' },
    { number: '3', title: '知识采集', description: 'AI引导式采集' },
    { number: '4', title: '开始使用', description: 'AI问答、对外服务' },
  ]

  return (
    <Layout>
      <Header
        style={{
          background: '#fff',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0F766E' }}>
            KnosAI
          </h1>
        </div>
        <Space>
          <Button type="text" onClick={() => navigate('/login')}>
            登录
          </Button>
          <Button type="primary" onClick={() => navigate('/register')}>
            免费开始
          </Button>
        </Space>
      </Header>

      <Content>
        {/* Hero区域 */}
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #fff 100%)',
          }}
        >
          <Title level={1} style={{ marginBottom: 16 }}>
            把团队经验沉淀成智能知识库
          </Title>
          <Paragraph
            style={{
              fontSize: 18,
              color: '#666',
              maxWidth: 600,
              margin: '0 auto 32px',
            }}
          >
            帮企业把团队脑子里的经验、散落的文档、重复的客户咨询，沉淀成随时可查可问的内部知识库。
          </Paragraph>
          <Space size="middle">
            <Button type="primary" size="large" onClick={() => navigate('/register')}>
              免费开始
            </Button>
            <Button size="large" onClick={() => navigate('/login')}>
              登录
            </Button>
          </Space>
        </div>

        {/* 功能特性 */}
        <div style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
            核心功能
          </Title>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{ textAlign: 'center', height: '100%' }}
                >
                  <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph style={{ color: '#666' }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 使用流程 */}
        <div
          style={{
            padding: '80px 24px',
            background: '#f5f5f4',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
              4步开始使用
            </Title>
            <Row gutter={[24, 24]} justify="center">
              {steps.map((step, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#0F766E',
                        color: '#fff',
                        fontSize: 24,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      {step.number}
                    </div>
                    <Title level={4}>{step.title}</Title>
                    <Paragraph style={{ color: '#666' }}>
                      {step.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA区域 */}
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
          }}
        >
          <Title level={2} style={{ marginBottom: 16 }}>
            开始构建您的智能知识库
          </Title>
          <Paragraph
            style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 32,
            }}
          >
            免费注册，立即体验AI驱动的知识管理
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/register')}
          >
            免费开始
          </Button>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#1C1917', color: '#fff' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ color: '#0F766E', margin: 0 }}>KnosAI</h2>
        </div>
        <div style={{ color: '#666' }}>
          © 2026 KnosAI. All rights reserved.
        </div>
      </Footer>
    </Layout>
  )
}

export default Home
