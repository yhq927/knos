import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import AuthRoute from './components/Auth/AuthRoute'
import ErrorBoundary from './components/ErrorBoundary'

const { Title, Text } = Typography

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Knowledge = lazy(() => import('./pages/Knowledge'))
const Chat = lazy(() => import('./pages/Chat'))
const Collect = lazy(() => import('./pages/Collect'))
const Upload = lazy(() => import('./pages/Upload'))
const Settings = lazy(() => import('./pages/Settings'))
const Analytics = lazy(() => import('./pages/Analytics'))

// 平台管理后台页面
const AdminLogin = lazy(() => import('./pages/Admin/Login'))
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminEnterprises = lazy(() => import('./pages/Admin/Enterprises'))
const AdminSettings = lazy(() => import('./pages/Admin/Settings'))

// 加载中组件
const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0a0a0a',
  }}>
    <Spin size="large" />
  </div>
)

// 404 页面
const NotFound = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0a0a0a',
      padding: 40,
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}
      >
        404
      </div>
      <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
        页面不存在
      </Title>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, display: 'block', marginBottom: 32 }}>
        您访问的页面不存在或已被移除
      </Text>
      <Link to="/">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#667eea',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <HomeOutlined /> 返回首页
        </div>
      </Link>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 公开页面 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 需要认证的页面 */}
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/knowledge"
            element={
              <AuthRoute>
                <MainLayout>
                  <Knowledge />
                </MainLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthRoute>
                <MainLayout>
                  <Chat />
                </MainLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/collect"
            element={
              <AuthRoute>
                <MainLayout>
                  <Collect />
                </MainLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <AuthRoute>
                <MainLayout>
                  <Upload />
                </MainLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <AuthRoute>
                <MainLayout>
                  <Analytics />
                </MainLayout>
              </AuthRoute>
            }
          />

          {/* 平台管理后台 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="enterprises" element={<AdminEnterprises />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404页面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
