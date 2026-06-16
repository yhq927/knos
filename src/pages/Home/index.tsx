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
  BookOutlined,
  BankOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
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
      color: '#2563EB',
      bg: '#E0E7FF',
    },
    {
      icon: <BankOutlined />,
      industry: '金融服务',
      company: '某城商银行',
      buildMethod: '文档自动解析',
      story: '银行有大量合规文档、产品手册、培训资料，200+份PDF文档。之前人工整理要2个月，现在用KnosAI的文档解析功能，上传后自动提取知识点，3天完成全部入库。AI还能自动识别文档中的FAQ和操作流程。',
      beforeBuild: '2个月，人工整理',
      afterBuild: '3天，自动解析入库',
      color: '#0EA5E9',
      bg: '#E0F2FE',
    },
    {
      icon: <MedicineBoxOutlined />,
      industry: '医疗健康',
      company: '某三甲医院',
      buildMethod: 'AI引导 + 行业知识库',
      story: '医疗知识更新快，科室经验难传承。KnosAI预置了医疗行业知识库，新医生进来就有基础，再用AI引导采集补充科室特色经验。1周内建好科室知识库，老医生退休前的经验都沉淀下来了。',
      beforeBuild: '经验随人走，无法沉淀',
      afterBuild: '1周建好科室知识库',
      color: '#8B5CF6',
      bg: '#EDE9FE',
    },
  ]

  // 竞品对比
  const competitorData = [
    { feature: '知识采集方式', knosai: 'AI引导式问答，主动采集', traditional: '手动录入，效率低', chatgpt: '无知识沉淀' },
    { feature: '企业知识管理', knosai: '结构化管理，版本控制', traditional: '文档堆砌，难以检索', chatgpt: '无企业知识管理' },
    { feature: '数据隐私', knosai: '自定义API Key，数据私有', traditional: '数据存储在第三方', chatgpt: '数据可能被用于训练' },
    { feature: '对外服务能力', knosai: '可嵌入官网，客户直接问', traditional: '无对外服务能力', chatgpt: '通用对话，无品牌定制' },
    { feature: '行业知识库', knosai: '预置行业最佳实践', traditional: '需要从零建设', chatgpt: '通用知识，无行业深度' },
    { feature: '上手难度', knosai: '10分钟上手，AI引导', traditional: '需要培训，学习成本高', chatgpt: '简单但无法定制' },
  ]

  const competitorColumns = [
    { title: '功能对比', dataIndex: 'feature', key: 'feature', width: 150 },
    {
      title: 'KnosAI',
      dataIndex: 'knosai',
      key: 'knosai',
      render: (text: string) => (
        <div>
          <CheckCircleOutlined style={{ color: '#10B981', marginRight: 8 }} />
          <Text style={{ color: '#111827', fontWeight: 600 }}>{text}</Text>
        </div>
      ),
    },
    {
      title: '传统知识库',
      dataIndex: 'traditional',
      key: 'traditional',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{text}</Text>,
    },
    {
      title: 'ChatGPT',
      dataIndex: 'chatgpt',
      key: 'chatgpt',
      render: (text: string) => <Text style={{ color: '#6B7280' }}>{text}</Text>,
    },
  ]

  // 定价方案
  const pricingPlans = [
    {
      name: '免费版',
      price: '¥0',
      period: '/月',
      description: '适合个人或小团队试用',
      features: ['1个企业', '10个成员', '500条知识', '50次AI试用', '单文件20MB', '基础功能'],
      cta: '免费开始',
      popular: false,
    },
    {
      name: '专业版',
      price: '¥299',
      period: '/月',
      description: '适合成长型企业',
      features: ['不限成员', '不限知识', '1000次AI问答/月', '单文件100MB', '对外服务功能', '数据导出', '优先支持'],
      cta: '立即升级',
      popular: true,
    },
    {
      name: '企业版',
      price: '面议',
      period: '',
      description: '适合大型企业',
      features: ['专业版全部功能', 'SSO单点登录', '私有化部署', '定制AI微调', '专属客户经理', 'SLA保障'],
      cta: '联系我们',
      popular: false,
    },
  ]

  // 客户可以用KnosAI做什么
  const useCases = [
    { icon: <BookOutlined />, title: '新员工培训', description: '新员工直接问AI，快速上手，培训周期缩短60%' },
    { icon: <TeamOutlined />, title: '客户服务', description: '客户直接问AI，7x24小时自动回复，减少80%重复咨询' },
    { icon: <SyncOutlined />, title: '知识传承', description: '老员工经验沉淀，避免知识流失，团队智慧永续' },
    { icon: <ThunderboltOutlined />, title: '效率提升', description: '找资料从30分钟变成30秒，团队效率提升50%' },
    { icon: <GlobalOutlined />, title: '对外展示', description: '嵌入官网，客户自助查询，提升品牌形象' },
    { icon: <LockOutlined />, title: '合规管理', description: '政策法规知识库，确保团队合规操作' },
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
    { q: 'KnosAI和ChatGPT有什么区别？', a: 'ChatGPT是通用AI，没有企业知识管理能力。KnosAI专注于企业知识沉淀，可以导入企业文档、采集团队经验，让AI基于企业专属知识库回答问题。' },
    { q: '我的数据安全吗？', a: '非常安全。您可以使用自己的API Key，数据直接走您和AI服务商之间，我们不存储您的AI对话内容。企业知识库采用加密存储，多租户隔离。' },
    { q: '支持哪些文件格式？', a: '支持Word、PDF、Excel、Markdown、TXT等常见文档格式，单文件最大100MB（专业版）。' },
    { q: '免费版有什么限制？', a: '免费版支持1个企业、10个成员、500条知识、50次AI试用。注册即送50次免费AI问答，用完后可以填入自己的API Key继续使用。' },
    { q: '如何嵌入到我的官网？', a: '专业版支持Widget嵌入，只需复制一段JS代码到您的官网，客户就可以直接在您的网站上问AI。' },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* 导航栏 */}
      <Header
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            }}
          >
            K
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
            KnosAI
          </span>
        </div>

        {/* 导航菜单 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-menu">
          <a href="#features" style={{ color: '#6B7280', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            功能特性
          </a>
          <a href="#use-cases" style={{ color: '#6B7280', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            使用场景
          </a>
          <a href="#pricing" style={{ color: '#6B7280', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            定价方案
          </a>
          <a href="#faq" style={{ color: '#6B7280', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            FAQ
          </a>
        </div>

        <Space size={12}>
          <Button
            type="text"
            style={{ color: '#374151', fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            登录
          </Button>
          <Button
            type="primary"
            style={{
              background: '#2563EB',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
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
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '-20%',
              width: '80%',
              height: '120%',
              background: 'radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
              animation: 'pulse 8s ease-in-out infinite',
            }}
          />

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 1000 }}>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: 100,
                background: '#E0E7FF',
                border: '1px solid #C7D2FE',
                marginBottom: 32,
              }}
            >
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600 }}>
                🚀 注册即送50次免费AI问答
              </Text>
            </div>

            <Title
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#111827',
                marginBottom: 24,
                lineHeight: 1.1,
                letterSpacing: '-2px',
              }}
            >
              把团队经验
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
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
                color: '#6B7280',
                maxWidth: 700,
                margin: '0 auto 48px',
                lineHeight: 1.8,
              }}
            >
              帮企业把团队脑子里的经验、散落的文档、重复的客户咨询，沉淀成随时可查可问的内部知识库。
              <br />
              <strong style={{ color: '#2563EB' }}>10分钟上手，AI引导采集，数据完全私有。</strong>
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
                  background: '#2563EB',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
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
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  color: '#374151',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onClick={() => navigate('/login')}
              >
                登录
              </Button>
            </Space>

            <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
              {['AI驱动的智能知识管理', '企业数据完全私有', '10分钟快速上手', '多端适配随时随地'].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleOutlined style={{ color: '#10B981', fontSize: 16 }} />
                  <Text style={{ color: '#6B7280', fontSize: 14 }}>{benefit}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 客户能做什么 */}
        <div id="use-cases" style={{ padding: '120px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                使用场景
              </Text>
              <Title style={{ color: '#111827', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                用KnosAI能做什么？
              </Title>
              <Paragraph style={{ color: '#6B7280', fontSize: 18, maxWidth: 600, margin: '16px auto 0' }}>
                从新员工培训到客户服务，KnosAI帮您解决知识管理的所有痛点
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {useCases.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 20,
                      height: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    styles={{ body: { padding: 32 } }}
                    hoverable
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        background: '#E0E7FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: '#2563EB',
                        marginBottom: 20,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Title level={4} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>
                      {item.title}
                    </Title>
                    <Paragraph style={{ color: '#6B7280', margin: 0, fontSize: 15, lineHeight: 1.8 }}>
                      {item.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* 客户案例 - 聚焦知识库构建 */}
        <div style={{ padding: '120px 24px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                客户案例
              </Text>
              <Title style={{ color: '#111827', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                知识库构建，从未如此简单
              </Title>
              <Paragraph style={{ color: '#6B7280', fontSize: 18, maxWidth: 700, margin: '16px auto 0' }}>
                传统方式需要数月才能建好的知识库，用KnosAI只需几天
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {userStories.map((story, index) => (
                <Col xs={24} lg={8} key={index}>
                  <Card
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 20,
                      height: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    styles={{ body: { padding: 32 } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: story.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          color: story.color,
                        }}
                      >
                        {story.icon}
                      </div>
                      <div>
                        <Text style={{ color: '#111827', fontWeight: 600, display: 'block' }}>{story.company}</Text>
                        <Tag
                          style={{
                            background: '#E0E7FF',
                            border: '1px solid #C7D2FE',
                            color: '#2563EB',
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
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          color: '#D97706',
                          borderRadius: 100,
                          padding: '4px 12px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <ThunderboltOutlined /> {story.buildMethod}
                      </Tag>
                    </div>

                    <Paragraph style={{ color: '#374151', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                      "{story.story}"
                    </Paragraph>

                    {/* 构建效果对比 */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: 12,
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          textAlign: 'center',
                        }}
                      >
                        <Text style={{ color: '#9CA3AF', fontSize: 11, display: 'block', marginBottom: 4 }}>
                          传统方式
                        </Text>
                        <Text style={{ color: '#D97706', fontWeight: 600, fontSize: 13 }}>
                          {story.beforeBuild}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#2563EB' }}>
                        <ArrowRightOutlined />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: 12,
                          background: '#D1FAE5',
                          border: '1px solid #A7F3D0',
                          textAlign: 'center',
                        }}
                      >
                        <Text style={{ color: '#9CA3AF', fontSize: 11, display: 'block', marginBottom: 4 }}>
                          使用KnosAI
                        </Text>
                        <Text style={{ color: '#059669', fontWeight: 600, fontSize: 13 }}>
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
        <div id="features" style={{ padding: '120px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                核心特色
              </Text>
              <Title style={{ color: '#111827', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                三种方式，快速构建知识库
              </Title>
              <Paragraph style={{ color: '#6B7280', fontSize: 18, maxWidth: 700, margin: '16px auto 0' }}>
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
                  color: '#2563EB',
                  bg: '#E0E7FF',
                },
                {
                  icon: <CloudUploadOutlined />,
                  title: '文档自动解析',
                  desc: '上传现有文档，AI自动提取知识点，结构化入库',
                  features: ['支持PDF/Word/Excel', '智能分块提取', '批量处理'],
                  color: '#8B5CF6',
                  bg: '#EDE9FE',
                },
                {
                  icon: <BookOutlined />,
                  title: '行业知识库',
                  desc: '预置行业最佳实践，新企业进来就有基础，不用从零开始',
                  features: ['行业模板', '持续更新', '脱敏安全'],
                  color: '#0EA5E9',
                  bg: '#E0F2FE',
                },
              ].map((item, index) => (
                <Col xs={24} lg={8} key={index}>
                  <Card
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 20,
                      height: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    styles={{ body: { padding: 32 } }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        background: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: item.color,
                        marginBottom: 20,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Title level={3} style={{ color: '#111827', marginBottom: 12, fontWeight: 700 }}>{item.title}</Title>
                    <Paragraph style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                      {item.desc}
                    </Paragraph>
                    <div>
                      {item.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <CheckCircleOutlined style={{ color: '#10B981', fontSize: 14 }} />
                          <Text style={{ color: '#374151', fontSize: 14 }}>{feature}</Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 飞轮效应 */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                飞轮效应
              </Text>
              <Title style={{ color: '#111827', fontSize: 36, marginTop: 16, fontWeight: 800 }}>
                越用越聪明的正循环
              </Title>
              <Paragraph style={{ color: '#6B7280', fontSize: 16, maxWidth: 700, margin: '16px auto 0' }}>
                你贡献的经验，会让整个行业知识库更完善 —— 而完善的行业知识库，又会反过来服务你的企业。
              </Paragraph>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {flywheelSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <Card
                    style={{
                      background: '#F0F7FF',
                      border: '1px solid #C7D2FE',
                      borderRadius: 20,
                      width: 220,
                      textAlign: 'center',
                    }}
                    styles={{ body: { padding: 24 } }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#fff',
                        margin: '0 auto 16px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                      }}
                    >
                      {step.num}
                    </div>
                    <Title level={4} style={{ color: '#111827', marginBottom: 8 }}>{step.title}</Title>
                    <Text style={{ color: '#6B7280' }}>{step.desc}</Text>
                  </Card>
                  {index < flywheelSteps.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#2563EB', fontSize: 24 }}>
                      <ArrowRightOutlined />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* 竞品对比 */}
        <div style={{ padding: '120px 24px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                竞品对比
              </Text>
              <Title style={{ color: '#111827', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                为什么选择KnosAI？
              </Title>
            </div>

            <Card
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              styles={{ body: { padding: 0 } }}
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
        <div id="pricing" style={{ padding: '120px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                定价方案
              </Text>
              <Title style={{ color: '#111827', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
                选择适合您的方案
              </Title>
              <Paragraph style={{ color: '#6B7280', fontSize: 18 }}>
                注册即送50次免费AI问答，无需信用卡
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center">
              {pricingPlans.map((plan, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    style={{
                      background: '#FFFFFF',
                      border: plan.popular ? '2px solid #2563EB' : '1px solid #E5E7EB',
                      borderRadius: 20,
                      height: '100%',
                      position: 'relative',
                      boxShadow: plan.popular ? '0 10px 30px rgba(37,99,235,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    styles={{ body: { padding: 32 } }}
                  >
                    {plan.popular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -1,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#2563EB',
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
                      <Title level={3} style={{ color: '#111827', marginBottom: 8, fontWeight: 700 }}>{plan.name}</Title>
                      <div>
                        <span style={{ fontSize: 48, fontWeight: 900, color: '#111827' }}>{plan.price}</span>
                        <span style={{ color: '#6B7280' }}>{plan.period}</span>
                      </div>
                      <Text style={{ color: '#6B7280' }}>{plan.description}</Text>
                    </div>
                    <div style={{ marginBottom: 32 }}>
                      {plan.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <CheckCircleOutlined style={{ color: '#10B981' }} />
                          <Text style={{ color: '#374151' }}>{feature}</Text>
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
                              background: '#2563EB',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                            }
                          : {
                              background: '#F3F4F6',
                              border: '1px solid #E5E7EB',
                              color: '#374151',
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
        <div id="faq" style={{ padding: '120px 24px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                常见问题
              </Text>
              <Title style={{ color: '#111827', fontSize: 48, marginTop: 16, fontWeight: 800 }}>
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
                  header={<Text style={{ color: '#111827', fontSize: 16, fontWeight: 600 }}>{item.q}</Text>}
                  key={index}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px !important',
                    marginBottom: 16,
                    overflow: 'hidden',
                  }}
                >
                  <Text style={{ color: '#374151', fontSize: 15, lineHeight: 1.8 }}>
                    {item.a}
                  </Text>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>

        {/* CTA区域 */}
        <div style={{ padding: '120px 24px', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
            }}
          />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Title style={{ color: '#111827', fontSize: 48, marginBottom: 16, fontWeight: 800 }}>
              开始构建您的智能知识库
            </Title>
            <Paragraph style={{ color: '#6B7280', fontSize: 18, marginBottom: 48 }}>
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
                background: '#2563EB',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
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
          background: '#F9FAFB',
          padding: '48px 24px',
          borderTop: '1px solid #E5E7EB',
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
                    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
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
                <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>KnosAI</span>
              </div>
              <Paragraph style={{ color: '#6B7280', margin: 0 }}>
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
                <Title level={5} style={{ color: '#374151', marginBottom: 16, fontWeight: 600 }}>
                  {section.title}
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {section.links.map((link, i) => (
                    <a key={i} style={{ color: '#6B7280' }}>{link}</a>
                  ))}
                </div>
              </Col>
            ))}
          </Row>
          <div
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: '1px solid #E5E7EB',
              textAlign: 'center',
            }}
          >
            <Text style={{ color: '#9CA3AF', fontSize: 13 }}>
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
        .nav-menu a:hover {
          color: #2563EB !important;
        }
        .ant-card:hover {
          transform: translateY(-4px);
          border-color: #C7D2FE !important;
          box-shadow: 0 10px 25px rgba(37,99,235,0.1) !important;
        }
        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.35) !important;
        }
      `}</style>
    </Layout>
  )
}

export default Home
