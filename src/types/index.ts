// 用户相关类型
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  enterpriseId: string
  status: 'active' | 'inactive' | 'deleted'
  createdAt: string
  updatedAt: string
}

// 企业相关类型
export interface Enterprise {
  id: string
  name: string
  industry: string
  size?: string
  description?: string
  slug: string
  planType: 'free' | 'pro' | 'enterprise'
  contactPhone?: string
  contactEmail?: string
  logoUrl?: string
  settings: EnterpriseSettings
  createdAt: string
  updatedAt: string
}

export interface EnterpriseSettings {
  welcomeMessage?: string
  brandColor?: string
  publicEnabled?: boolean
}

// 知识库相关类型
export interface KnowledgeEntry {
  id: string
  enterpriseId: string
  businessUnitId?: string
  parentId?: string
  title: string
  content: string
  contentType: 'faq' | 'sop' | 'guide' | 'policy' | 'other'
  visibility: 'private' | 'team' | 'link' | 'public'
  version: number
  vectorId?: string
  metadata: Record<string, any>
  createdBy: string
  status: 'draft' | 'review' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

// 业务单元类型
export interface BusinessUnit {
  id: string
  enterpriseId: string
  name: string
  description?: string
  parentId?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// AI问答相关类型
export interface Conversation {
  id: string
  enterpriseId: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  sources?: MessageSource[]
  confidence?: 'high' | 'medium' | 'low'
  followUpQuestions?: string[]
  createdAt: string
}

export interface MessageSource {
  type: 'enterprise' | 'industry' | 'ai'
  name: string
  url?: string
}

// 文件上传类型
export interface FileUpload {
  id: string
  enterpriseId: string
  userId: string
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  storagePath: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  errorMessage?: string
  parsedCount: number
  createdAt: string
  updatedAt: string
}

// 通知类型
export interface Notification {
  id: string
  userId: string
  enterpriseId: string
  type: string
  title: string
  content: string
  link?: string
  metadata: Record<string, any>
  isRead: boolean
  readAt?: string
  createdAt: string
}

// 活动日志类型
export interface Activity {
  id: string
  enterpriseId: string
  userId?: string
  action: string
  resourceType: string
  resourceId?: string
  details: Record<string, any>
  createdAt: string
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  meta?: {
    page: number
    pageSize: number
    total: number
  }
}

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 搜索参数
export interface SearchParams extends PaginationParams {
  keyword?: string
  category?: string
  status?: string
  startDate?: string
  endDate?: string
}

// 用户登录参数
export interface LoginParams {
  email: string
  password: string
}

// 用户注册参数
export interface RegisterParams {
  email: string
  password: string
  companyName: string
  industry: string
  size?: string
}

// 创建知识条目参数
export interface CreateKnowledgeParams {
  title: string
  content: string
  contentType: string
  visibility?: string
  businessUnitId?: string
  tags?: string[]
}

// 更新知识条目参数
export interface UpdateKnowledgeParams {
  title?: string
  content?: string
  contentType?: string
  visibility?: string
  status?: string
}

// AI问答参数
export interface ChatParams {
  message: string
  conversationId?: string
}

// 版本信息
export interface KnowledgeVersion {
  id: string
  knowledgeId: string
  version: number
  title: string
  content: string
  metadata: Record<string, any>
  createdBy: string
  createdAt: string
}

// 通知设置
export interface NotificationSettings {
  emailEnabled: boolean
  emailTypes: string[]
  pushEnabled: boolean
  pushTypes: string[]
}

// 使用统计
export interface UsageStats {
  aiChatCount: number
  knowledgeCount: number
  activeUsers: number
  adoptionRate: number
}

// 趋势数据
export interface TrendData {
  date: string
  value: number
}

// 热门问题
export interface HotQuestion {
  question: string
  count: number
  lastAsked: string
}
