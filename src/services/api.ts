import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { message } from 'antd'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回完整响应，由各API自行处理
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Token过期或无效，清除认证状态并跳转到登录页
          useAuthStore.getState().logout()
          window.location.href = '/login'
          message.error('登录已过期，请重新登录')
          break
        case 403:
          message.error('没有权限执行此操作')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 429:
          message.error('请求过于频繁，请稍后再试')
          break
        case 500:
          message.error('服务器错误，请稍后再试')
          break
        default:
          message.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

export default api

// 认证相关API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { email: string; password: string; companyName: string; industry: string; size?: string }) =>
    api.post('/auth/register', data),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
  
  refreshToken: () =>
    api.post('/auth/refresh'),
  
  logout: () =>
    api.post('/auth/logout'),
}

// 企业相关API
export const enterpriseApi = {
  getInfo: () =>
    api.get('/enterprise'),
  
  update: (data: any) =>
    api.put('/enterprise', data),
  
  getStats: () =>
    api.get('/enterprise/stats'),
  
  testApiKey: (data: { provider: string; apiKey: string }) =>
    api.post('/enterprise/test-key', data),
  
  resetSlug: () =>
    api.post('/enterprise/reset-slug'),
}

// 知识库相关API
export const knowledgeApi = {
  getList: (params?: any) =>
    api.get('/knowledge', { params }),
  
  getById: (id: string) =>
    api.get(`/knowledge/${id}`),
  
  create: (data: any) =>
    api.post('/knowledge', data),
  
  update: (id: string, data: any) =>
    api.put(`/knowledge/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/knowledge/${id}`),
  
  getVersions: (id: string, params?: any) =>
    api.get(`/knowledge/${id}/versions`, { params }),
  
  getVersion: (id: string, version: number) =>
    api.get(`/knowledge/${id}/versions/${version}`),
  
  diffVersions: (id: string, from: number, to: number) =>
    api.get(`/knowledge/${id}/versions/diff`, { params: { from, to } }),
  
  rollbackVersion: (id: string, version: number) =>
    api.post(`/knowledge/${id}/versions/${version}/rollback`),
}

// AI问答相关API
export const chatApi = {
  getHistory: (params?: any) =>
    api.get('/chat/history', { params }),
  
  sendMessage: (data: { message: string; conversationId?: string }) =>
    api.post('/chat', data),
  
  sendFeedback: (messageId: string, type: 'helpful' | 'not_helpful') =>
    api.post('/chat/feedback', { messageId, type }),
}

// 知识采集相关API
export const collectApi = {
  getGoals: () =>
    api.get('/collect/goals'),
  
  getCurrentQuestion: () =>
    api.get('/collect/current'),
  
  submitAnswer: (questionId: string, answer: string) =>
    api.post('/collect/answer', { questionId, answer }),
  
  skipQuestion: (questionId: string) =>
    api.post('/collect/skip', { questionId }),
}

// 文件上传相关API
export const uploadApi = {
  upload: (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
      },
    })
  },
  
  getList: (params?: any) =>
    api.get('/upload', { params }),
  
  getStatus: (id: string) =>
    api.get(`/upload/${id}/status`),
  
  reparse: (id: string) =>
    api.post(`/upload/${id}/reparse`),
}

// 成员管理相关API
export const membersApi = {
  getList: (params?: any) =>
    api.get('/members', { params }),
  
  invite: (data: { email: string; role: string }) =>
    api.post('/members/invite', data),
  
  updateRole: (id: string, role: string) =>
    api.put(`/members/${id}/role`, { role }),
  
  remove: (id: string) =>
    api.delete(`/members/${id}`),
}

// 业务单元相关API
export const businessUnitsApi = {
  getList: () =>
    api.get('/business-units'),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/business-units', data),
  
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/business-units/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/business-units/${id}`),
}

// 通知相关API
export const notificationsApi = {
  getList: (params?: any) =>
    api.get('/notifications', { params }),
  
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
  
  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
  
  getSettings: () =>
    api.get('/notifications/settings'),
  
  updateSettings: (data: any) =>
    api.put('/notifications/settings', data),
}

// 数据分析相关API
export const analyticsApi = {
  getOverview: (params?: any) =>
    api.get('/analytics/overview', { params }),
  
  getChatStats: (params?: any) =>
    api.get('/analytics/chat', { params }),
  
  getChatTrend: (params?: any) =>
    api.get('/analytics/chat/trend', { params }),
  
  getHotQuestions: (limit?: number) =>
    api.get('/analytics/chat/hot', { params: { limit } }),
  
  getUncoveredQuestions: (limit?: number) =>
    api.get('/analytics/chat/uncovered', { params: { limit } }),
  
  getKnowledgeStats: (params?: any) =>
    api.get('/analytics/knowledge', { params }),
  
  getUserStats: (params?: any) =>
    api.get('/analytics/users', { params }),
  
  getUserRanking: (limit?: number) =>
    api.get('/analytics/users/ranking', { params: { limit } }),
}

// 套餐与计费相关API
export const billingApi = {
  getPlan: () =>
    api.get('/billing/plan'),
  
  getUsage: () =>
    api.get('/billing/usage'),
  
  upgrade: (planType: string) =>
    api.post('/billing/upgrade', { planType }),
}

// 对外服务相关API
export const publicApi = {
  getInfo: (slug: string) =>
    api.get(`/public/${slug}`),
  
  chat: (slug: string, message: string) =>
    api.post(`/public/${slug}/chat`, { message }),
  
  getKnowledge: (slug: string, params?: any) =>
    api.get(`/public/${slug}/knowledge`, { params }),
  
  submitLead: (slug: string, data: any) =>
    api.post(`/public/${slug}/leads`, data),
}
