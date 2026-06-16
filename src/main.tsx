import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#2563EB',
            colorBgContainer: '#FFFFFF',
            colorBgLayout: '#F8FAFC',
            colorText: '#111827',
            colorTextSecondary: '#6B7280',
            colorTextTertiary: '#9CA3AF',
            colorTextQuaternary: '#D1D5DB',
            borderRadius: 8,
            colorBorder: '#E5E7EB',
            colorBorderSecondary: '#F3F4F6',
            colorBgElevated: '#FFFFFF',
            colorFillContent: '#F9FAFB',
            colorFillContentHover: '#F3F4F6',
            colorBgSpotlight: '#F3F4F6',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
            controlHeight: 40,
          },
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
