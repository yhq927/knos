import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
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
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(245, 87, 108, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: 36,
              }}
            >
              ⚠️
            </div>
            <Title level={3} style={{ color: '#fff', marginBottom: 12 }}>
              页面出现错误
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 }}>
              {this.state.error?.message || '发生了未知错误，请尝试刷新页面'}
            </Paragraph>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              size="large"
              onClick={() => window.location.reload()}
              style={{
                height: 48,
                padding: '0 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              刷新页面
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
