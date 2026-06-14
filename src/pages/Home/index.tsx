import React from 'react'
import { Button, Card, Row, Col, Typography, Space, Layout, Table, Tag, Collapse } from 'antd'
import {
  RobotOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  LockOutlined,
  RocketOutlined,
  StarOutlined,
  TrophyOutlined,
  HeartOutlined,
  UserOutlined,
  BankOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography
const { Header, Content, Footer } = Layout
const { Panel } = Collapse

const Home: React.FC = () => {
  const navigate = useNavigate()

  // 客户案例 - 聚焦知识库构建特色
  const userStories = [
    {
      icon: <ShopOutlined />,
      industry: '连锁餐饮',
      company: '某知名连锁品牌',
      buildMethod: 'AI引导采集 + 文档上传',
      story: '200+门店的运营经验分散在各店长脑子里，之前尝试用Word文档整理，3个月才录入50条。用KnosAI的AI引导采集，2天就沉淀了300+条知识，AI会主动问"新员工如何快速上手？""高峰期如何排班？"，把隐性经验变成显性知识。',
      beforeBuild: '3个月，50条知识',
      afterBuild: '2天，300+条知识',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <BankOutlined />,
      industry: '金融服务',
      company: '某城商银行',
      buildMethod: '文档自动解析',
      story: '银行有大量合规文档、产品手册、培训资料，200+份PDF文档。之前人工整理要2个月，现在用KnosAI的文档解析功能，上传后自动提取知识点，3天完成全部入库。AI还能自动识别文档中的FAQ和操作流程。',
      beforeBuild: '2个月，人工整理',
      afterBuild: '3天，自动解析入库',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <MedicineBoxOutlined />,
      industry: '医疗健康',
      company: '某三甲医院',
      buildMethod: 'AI引导 + 行业知识库',
      story: '医疗知识更新快，科室经验难传承。KnosAI预置了医疗行业知识库，新医生进来就有基础，再用AI引导采集补充科室特色经验。1周内建好科室知识库，老医生退休前的经验都沉淀下来了。',
      beforeBuild: '经验随人走，无法沉淀',
      afterBuild: '1周建好科室知识库',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ]

  // 竞品对比
  const competitorData = [
    {
      feature: '知识采集方式',
      knosai: 'AI引导式问答，主动采集',
      traditional: '手动录入，效率低',
      chatgpt: '无知识沉淀',
    },
    {
      feature: '企业知识管理',
      knosai: '结构化管理，版本控制',
      traditional: '文档堆砌，难以检索',
      chatgpt: '无企业知识管理',
    },
    {
      feature: '数据隐私',
      knosai: '自定义API Key，数据私有',
      traditional: '数据存储在第三方',
      chatgpt: '数据可能被用于训练',
    },
    {
      feature: '对外服务能力',
      knosai: '可嵌入官网，客户直接问',
      traditional: '无对外服务能力',
      chatgpt: '通用对话，无品牌定制',
    },
    {
      feature: '行业知识库',
      knosai: '预置行业最佳实践',
      traditional: '需要从零建设',
      chatgpt: '通用知识，无行业深度',
    },
    {
      feature: '上手难度',
      knosai: '10分钟上手，AI引导',
      traditional: '需要培训，学习成本高',
      chatgpt: '简单但无法定制',
    },
  ]

  const competitorColumns = [
    {
      title: '功能对比',
      dataIndex: 'feature',
      key: 'feature',
      width: 150,
    },
    {
      title: 'KnosAI',
      dataIndex: 'knosai',
      key: 'knosai',
      render: (text: string) => (
        <div>
          <CheckCircleOutlined style={{ color: '#43e97b', marginRight: 8 }} />
          <Text style={{ color: '#fff' }}>{text}</Text>
        </div>
      ),
    },
    {
      title: '传统知识库',
      dataIndex: 'traditional',
      key: 'traditional',
      render: (text: string) => (
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</Text>
      ),
    },
    {
      title: 'ChatGPT',
      dataIndex: 'chatgpt',
      key: 'chatgpt',
      render: (text: string) => (
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</Text>
      ),
    },
  ]

  // 定价方案
  const pricingPlans = [
    {
      name: '免费版',
      price: '¥0',
      period: '/月',
      description: '适合个人或小团队试用',
      features: [
        '1个企业',
        '10个成员',
        '500条知识',
        '50次AI试用',
        '单文件20MB',
        '基础功能',
      ],
      cta: '免费开始',
      popular: false,
      gradient: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    },
    {
      name: '专业版',
      price: '¥299',
      period: '/月',
      description: '适合成长型企业',
      features: [
        '不限成员',
        '不限知识',
        '1000次AI问答/月',
        '单文件100MB',
        '对外服务功能',
        '数据导出',
        '优先支持',
      ],
      cta: '立即升级',
      popular: true,
      gradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
    },
    {
      name: '企业版',
      price: '面议',
      period: '',
      description: '适合大型企业',
      features: [
        '专业版全部功能',
        'SSO单点登录',
        '私有化部署',
        '定制AI微调',
        '专属客户经理',
        'SLA保障',
      ],
      cta: '联系我们',
      popular: false,
      gradient: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    },
  ]

  // 客户可以用KnosAI做什么
  const useCases = [
    {
      icon: <BookOutlined />,
      title: '新员工培训',
      description: '新员工直接问AI，快速上手，培训周期缩短60%',
    },
    {
      icon: <TeamOutlined />,
      title: '客户服务',
      description: '客户直接问AI，7x24小时自动回复，减少80%重复咨询',
    },
    {
      icon: <SyncOutlined />,
      title: '知识传承',
      description: '老员工经验沉淀，避免知识流失，团队智慧永续',
    },
    {
      icon: <ThunderboltOutlined />,
      title: '效率提升',
      description: '找资料从30分钟变成30秒，团队效率提升50%',
    },
    {
      icon: <GlobalOutlined />,
      title: '对外展示',
      description: '嵌入官网，客户自助查询，提升品牌形象',
    },
    {
      icon: <LockOutlined />,
      title: '合规管理',
      description: '政策法规知识库，确保团队合规操作',
    },
  ]

  // 飞轮效应
  const flywheelSteps = [
    { num: '01', title: '企业使用', desc: '企业录入知识，使用AI问答' },
    { num: '02', title: '数据积累', desc: '行业知识不断丰富' },
    { num: '03', title: 'AI进化', desc: 'AI回答越来越精准' },
    { num: '04', title: '价值提升', desc: '新企业进来就能用' },
  ]

  // FAQ
  const faqItems = [
    {
      q: 'KnosAI和ChatGPT有什么区别？',
      a: 'ChatGPT是通用AI，没有企业知识管理能力。KnosAI专注于企业知识沉淀，可以导入企业文档、采集团队经验，让AI基于企业专属知识库回答问题。',
    },
    {
      q: '我的数据安全吗？',
      a: '非常安全。您可以使用自己的API Key，数据直接走您和AI服务商之间，我们不存储您的AI对话内容。企业知识库采用加密存储，多租户隔离。',
    },
    {
      q: '支持哪些文件格式？',
      a: '支持Word、PDF、Excel、Markdown、TXT等常见文档格式，单文件最大100MB（专业版）。',
    },
    {
      q: '免费版有什么限制？',
      a: '免费版支持1个企业、10个成员、500条知识、50次AI试用。注册即送50次免费AI问答，用完后可以填入自己的API Key继续使用。',
    },
    {
      q: '如何嵌入到我的官网？',
      a: '专业版支持Widget嵌入，只需复制一段JS代码到您的官网，客户就可以直接在您的网站上问AI。',
    },
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

        {/* 导航菜单 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-menu">
          <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            功能特性
          </a>
          <a href="#use-cases" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            使用场景
          </a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            定价方案
          </a>
          <a href="#faq" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            FAQ
          </a>
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

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 1000 }}>
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
                🚀 注册即送50次免费AI问答
              </Text>
            </div>

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

            <Paragraph
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 700,
                margin: '0 auto 48px',
                lineHeight: 1.8,
              }}
            >
              帮企业把团队脑子里的经验、散落的文档、重复的客户咨询，沉淀成随时可查可问的内部知识库。
              <br />
              <strong style={{ color: '#667eea' }}>10分钟上手，AI引导采集，数据完全私有。</strong>
            </Paragraph>

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

            <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
              {['AI驱动的智能知识管理', '企业数据完全私有', '10分钟快速上手', '多端适配随时随地'].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 16 }} />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{benefit}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 客户能做什么 */}
        <div id="use-cases" style={{ padding: '120px 24px', background: '#0a0a0a' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                使用场景
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                用KnosAI能做什么？
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 600, margin: '16px auto 0' }}>
                从新员工培训到客户服务，KnosAI帮您解决知识管理的所有痛点
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {useCases.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 20,
                      height: '100%',
                    }}
                    bodyStyle={{ padding: 32 }}
                    hoverable
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: '#667eea',
                        marginBottom: 20,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Title level={4} style={{ color: '#fff', marginBottom: 8, fontWeight: 700 }}>
                      {item.title}
                    </Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: 15, lineHeight: 1.8 }}>
                      {item.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* 客户案例 - 聚焦知识库构建 */}
        <div style={{ padding: '120px 24px', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                客户案例
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                知识库构建，从未如此简单
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 700, margin: '16px auto 0' }}>
                传统方式需要数月才能建好的知识库，用KnosAI只需几天
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {userStories.map((story, index) => (
                <Col xs={24} lg={8} key={index}>
                  <Card
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 20,
                      height: '100%',
                    }}
                    bodyStyle={{ padding: 32 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: story.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          color: '#fff',
                        }}
                      >
                        {story.icon}
                      </div>
                      <div>
                        <Text style={{ color: '#fff', fontWeight: 600, display: 'block' }}>{story.company}</Text>
                        <Tag
                          style={{
                            background: 'rgba(102, 126, 234, 0.2)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            color: '#667eea',
                            borderRadius: 100,
                            fontSize: 11,
                          }}
                        >
                          {story.industry}
                        </Tag>
                      </div>
                    </div>

                    {/* 构建方式标签 */}
                    <div style={{ marginBottom: 16 }}>
                      <Tag
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          color: '#F97316',
                          borderRadius: 100,
                          padding: '4px 12px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <ThunderboltOutlined /> {story.buildMethod}
                      </Tag>
                    </div>

                    <Paragraph style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                      "{story.story}"
                    </Paragraph>

                    {/* 构建效果对比 */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: 12,
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          textAlign: 'center',
                        }}
                      >
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 4 }}>
                          传统方式
                        </Text>
                        <Text style={{ color: '#F59E0B', fontWeight: 600, fontSize: 13 }}>
                          {story.beforeBuild}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#667eea' }}>
                        <ArrowRightOutlined />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: 12,
                          background: 'rgba(67, 233, 123, 0.1)',
                          border: '1px solid rgba(67, 233, 123, 0.2)',
                          textAlign: 'center',
                        }}
                      >
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', marginBottom: 4 }}>
                          使用KnosAI
                        </Text>
                        <Text style={{ color: '#43e97b', fontWeight: 600, fontSize: 13 }}>
                          {story.afterBuild}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* 知识库构建特色 */}
        <div id="features" style={{ padding: '120px 24px', background: '#111' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                核心特色
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                三种方式，快速构建知识库
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 700, margin: '16px auto 0' }}>
                无论你的知识在哪里，KnosAI都能帮你快速沉淀
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 60 }}>
              {[
                {
                  icon: <RobotOutlined />,
                  title: 'AI引导采集',
                  desc: 'AI主动提问，引导团队成员把隐性经验变成显性知识',
                  features: ['动态生成问题', '目标导向采集', '10分钟上手'],
                  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                {
                  icon: <CloudUploadOutlined />,
                  title: '文档自动解析',
                  desc: '上传现有文档，AI自动提取知识点，结构化入库',
                  features: ['支持PDF/Word/Excel', '智能分块提取', '批量处理'],
                  gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                },
                {
                  icon: <BookOutlined />,
                  title: '行业知识库',
                  desc: '预置行业最佳实践，新企业进来就有基础，不用从零开始',
                  features: ['行业模板', '持续更新', '脱敏安全'],
                  gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                },
              ].map((item, index) => (
                <Col xs={24} lg={8} key={index}>
                  <Card
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 20,
                      height: '100%',
                    }}
                    bodyStyle={{ padding: 32 }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: '#fff',
                        marginBottom: 20,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Title level={3} style={{ color: '#fff', marginBottom: 12 }}>{item.title}</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                      {item.desc}
                    </Paragraph>
                    <div>
                      {item.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 14 }} />
                          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{feature}</Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 飞轮效应 */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                飞轮效应
              </Text>
              <Title style={{ color: '#fff', fontSize: 36, marginTop: 16, fontWeight: 800 }}>
                越用越聪明的正循环
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 700, margin: '16px auto 0' }}>
                你贡献的经验，会让整个行业知识库更完善 —— 而完善的行业知识库，又会反过来服务你的企业。
              </Paragraph>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {flywheelSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: 20,
                      width: 220,
                      textAlign: 'center',
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#fff',
                        margin: '0 auto 16px',
                      }}
                    >
                      {step.num}
                    </div>
                    <Title level={4} style={{ color: '#fff', marginBottom: 8 }}>{step.title}</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{step.desc}</Text>
                  </Card>
                  {index < flywheelSteps.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#667eea', fontSize: 24 }}>
                      <ArrowRightOutlined />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* 竞品对比 */}
        <div style={{ padding: '120px 24px', background: '#0a0a0a' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                竞品对比
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                为什么选择KnosAI？
              </Title>
            </div>

            <Card
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                overflow: 'hidden',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Table
                columns={competitorColumns}
                dataSource={competitorData}
                rowKey="feature"
                pagination={false}
              />
            </Card>
          </div>
        </div>

        {/* 定价方案 */}
        <div id="pricing" style={{ padding: '120px 24px', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                定价方案
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                选择适合您的方案
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>
                注册即送50次免费AI问答，无需信用卡
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center">
              {pricingPlans.map((plan, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    style={{
                      background: plan.gradient,
                      border: plan.popular
                        ? '2px solid #667eea'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 20,
                      height: '100%',
                      position: 'relative',
                    }}
                    bodyStyle={{ padding: 32 }}
                  >
                    {plan.popular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -1,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          padding: '4px 20px',
                          borderRadius: '0 0 12px 12px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#fff',
                        }}
                      >
                        最受欢迎
                      </div>
                    )}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>{plan.name}</Title>
                      <div>
                        <span style={{ fontSize: 48, fontWeight: 900, color: '#fff' }}>{plan.price}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{plan.period}</span>
                      </div>
                      <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{plan.description}</Text>
                    </div>
                    <div style={{ marginBottom: 32 }}>
                      {plan.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <CheckCircleOutlined style={{ color: '#43e97b' }} />
                          <Text style={{ color: 'rgba(255,255,255,0.7)' }}>{feature}</Text>
                        </div>
                      ))}
                    </div>
                    <Button
                      type={plan.popular ? 'primary' : 'default'}
                      block
                      size="large"
                      style={{
                        height: 52,
                        fontWeight: 600,
                        borderRadius: 12,
                        ...(plan.popular
                          ? {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                            }
                          : {
                              background: 'rgba(255,255,255,0.1)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#fff',
                            }),
                      }}
                      onClick={() => navigate('/register')}
                    >
                      {plan.cta}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" style={{ padding: '120px 24px', background: '#111' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Text style={{ color: '#667eea', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                常见问题
              </Text>
              <Title style={{ color: '#fff', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                FAQ
              </Title>
            </div>

            <Collapse
              accordion
              style={{ background: 'transparent', border: 'none' }}
              expandIconPosition="end"
            >
              {faqItems.map((item, index) => (
                <Panel
                  header={<Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{item.q}</Text>}
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px !important',
                    marginBottom: 16,
                    overflow: 'hidden',
                  }}
                >
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8 }}>
                    {item.a}
                  </Text>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>

        {/* CTA区域 */}
        <div style={{ padding: '120px 24px', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
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
              注册即送50次免费AI问答，无需信用卡
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
            {[
              { title: '产品', links: ['功能特性', '定价方案', '更新日志'] },
              { title: '资源', links: ['帮助中心', 'API文档', '博客'] },
              { title: '公司', links: ['关于我们', '联系我们', '隐私政策'] },
              { title: '关注', links: ['GitHub', 'Twitter', '微信公众号'] },
            ].map((section, index) => (
              <Col xs={12} lg={4} key={index}>
                <Title level={5} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontWeight: 600 }}>
                  {section.title}
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {section.links.map((link, i) => (
                    <a key={i} style={{ color: 'rgba(255,255,255,0.4)' }}>{link}</a>
                  ))}
                </div>
              </Col>
            ))}
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
        .ant-collapse-item {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px !important;
          margin-bottom: 16px !important;
        }
        .ant-collapse-header {
          color: #fff !important;
        }
        .ant-collapse-content {
          background: transparent !important;
          border-top: 1px solid rgba(255,255,255,0.05) !important;
        }
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
    </Layout>
  )
}

export default Home
