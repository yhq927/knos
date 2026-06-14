import React from 'react'
import { Button, Card, Row, Col, Typography, Space, Layout } from 'antd'
import {
  RobotOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography
const { Header, Content, Footer } = Layout

const Home: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <RobotOutlined />,
      title: '智能知识采集',
      description: 'AI引导式问答，10分钟完成首次知识沉淀',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <CloudUploadOutlined />,
      title: 'AI智能问答',
      description: '基于企业知识库的精准回答，附带来源标注',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <TeamOutlined />,
      title: '私有化部署',
      description: '支持自定义API Key，数据完全私有',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <SafetyOutlined />,
      title: '对外服务能力',
      description: '将知识库转化为客户服务工具',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ]

  const steps = [
    { number: '01', title: '注册企业', description: '1分钟完成注册' },
    { number: '02', title: '选择行业', description: '加载行业知识库' },
    { number: '03', title: '知识采集', description: 'AI引导式采集' },
    { number: '04', title: '开始使用', description: 'AI问答、对外服务' },
  ]

  const benefits = [
    'AI驱动的智能知识管理',
    '企业数据完全私有',
    '10分钟快速上手',
    '多端适配，随时随地',
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* 导航栏 */}
      <Header
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            K
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            KnosAI
          </span>
        </div>
        <Space size={12}>
          <Button
            type="text"
            style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            登录
          </Button>
          <Button
            type="primary"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
            onClick={() => navigate('/register')}
          >
            免费开始
          </Button>
        </Space>
      </Header>

      <Content>
        {/* Hero区域 */}
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px 80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 背景光效 */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle at 30% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
              animation: 'pulse 8s ease-in-out infinite',
            }}
          />

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 900 }}>
            {/* 标签 */}
            <div
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: 100,
                background: 'rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                marginBottom: 32,
              }}
            >
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600 }}>
                ✨ 企业智能知识管理平台
              </Text>
            </div>

            {/* 主标题 */}
            <Title
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#fff',
                marginBottom: 24,
                lineHeight: 1.1,
                letterSpacing: '-2px',
              }}
            >
              把团队经验
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                沉淀成智能知识库
              </span>
            </Title>

            {/* 副标题 */}
            <Paragraph
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 600,
                margin: '0 auto 48px',
                lineHeight: 1.8,
              }}
            >
              帮企业把团队脑子里的经验、散落的文档、重复的客户咨询，沉淀成随时可查可问的内部知识库。
            </Paragraph>

            {/* CTA按钮 */}
            <Space size={16}>
              <Button
                type="primary"
                size="large"
                style={{
                  height: 56,
                  padding: '0 40px',
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                }}
                onClick={() => navigate('/register')}
              >
                免费开始
                <ArrowRightOutlined />
              </Button>
              <Button
                size="large"
                style={{
                  height: 56,
                  padding: '0 40px',
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  color: '#fff',
                }}
                onClick={() => navigate('/login')}
              >
                登录
              </Button>
            </Space>

            {/* 特性列表 */}
            <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 16 }} />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{benefit}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 功能特性 */}
        <div style={{ padding: '120px 24px', background: '#0a0a0a' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                核心功能
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                为现代团队打造
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 500, margin: '16px auto 0' }}>
                强大的AI能力，让知识管理变得简单高效
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 20,
                      height: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    bodyStyle={{ padding: 32 }}
                    hoverable
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: feature.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: '#fff',
                        marginBottom: 24,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <Title level={4} style={{ color: '#fff', marginBottom: 12, fontWeight: 700 }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: 15, lineHeight: 1.8 }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* 使用流程 */}
        <div
          style={{
            padding: '120px 24px',
            background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                简单易用
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                4步开始使用
              </Title>
            </div>

            <Row gutter={[32, 32]} justify="center">
              {steps.map((step, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <div style={{ textAlign: 'center', position: 'relative' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        fontSize: 28,
                        fontWeight: 800,
                        color: '#667eea',
                      }}
                    >
                      {step.number}
                    </div>
                    <Title level={4} style={{ color: '#fff', marginBottom: 8, fontWeight: 700 }}>
                      {step.title}
                    </Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                      {step.description}
                    </Paragraph>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA区域 */}
        <div
          style={{
            padding: '120px 24px',
            background: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
            }}
          />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Title style={{ color: '#fff', fontSize: 48, marginBottom: 16, fontWeight: 800 }}>
              开始构建您的智能知识库
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, marginBottom: 48 }}>
              免费注册，立即体验AI驱动的知识管理
            </Paragraph>
            <Button
              type="primary"
              size="large"
              style={{
                height: 60,
                padding: '0 48px',
                fontSize: 18,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
              }}
              onClick={() => navigate('/register')}
            >
              免费开始
              <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </Content>

      {/* 页脚 */}
      <Footer
        style={{
          background: '#050505',
          padding: '48px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  K
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>KnosAI</span>
              </div>
              <Paragraph style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                企业智能知识管理平台
              </Paragraph>
            </Col>
            <Col xs={12} lg={4}>
              <Title level={5} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontWeight: 600 }}>
                产品
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>功能特性</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>定价方案</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>更新日志</a>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              <Title level={5} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontWeight: 600 }}>
                资源
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>帮助中心</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>API文档</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>博客</a>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              <Title level={5} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontWeight: 600 }}>
                公司
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>关于我们</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>联系我们</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>隐私政策</a>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              <Title level={5} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontWeight: 600 }}>
                关注我们
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>GitHub</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>Twitter</a>
                <a style={{ color: 'rgba(255,255,255,0.4)' }}>微信公众号</a>
              </div>
            </Col>
          </Row>
          <div
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center',
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              © 2026 KnosAI. All rights reserved.
            </Text>
          </div>
        </div>
      </Footer>

      {/* 全局样式 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-2%, -2%); }
        }
        
        .ant-card:hover {
          transform: translateY(-8px);
          border-color: rgba(102, 126, 234, 0.3) !important;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15) !important;
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5) !important;
        }
      `}</style>
    </Layout>
  )
}

export default Home
