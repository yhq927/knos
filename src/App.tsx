import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'
import MainLayout from './components/Layout/MainLayout'
import AuthRoute from './components/Auth/AuthRoute'

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Knowledge = lazy(() => import('./pages/Knowledge'))
const Chat = lazy(() => import('./pages/Chat'))
const Collect = lazy(() => import('./pages/Collect'))
const Upload = lazy(() => import('./pages/Upload'))
const Settings = lazy(() => import('./pages/Settings'))
const Analytics = lazy(() => import('./pages/Analytics'))

// 平台管理后台页面
const AdminLogin = lazy(() => import('./pages/Admin/Login'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminEnterprises = lazy(() => import('./pages/Admin/Enterprises'))

// 加载中组件
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
)

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 公开页面 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/enterprises" element={<AdminEnterprises />} />

        {/* 404页面 */}
        <Route path="*" element={<div>404 - 页面不存在</div>} />
      </Routes>
    </Suspense>
  )
}

export default App
