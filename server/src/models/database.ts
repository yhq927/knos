import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// User interface
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  enterpriseId: string;
  createdAt: string;
  updatedAt: string;
}

// Enterprise interface
export interface Enterprise {
  id: string;
  name: string;
  industry: string;
  size?: string;
  description?: string;
  slug: string;
  planType: 'free' | 'pro' | 'enterprise';
  apiKeys: {
    openai?: string;
    claude?: string;
    tongyi?: string;
  };
  settings: {
    publicEnabled: boolean;
    welcomeMessage?: string;
    brandColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Knowledge Entry interface
export interface KnowledgeEntry {
  id: string;
  enterpriseId: string;
  businessUnitId?: string;
  title: string;
  content: string;
  contentType: 'faq' | 'sop' | 'guide' | 'policy' | 'other';
  visibility: 'private' | 'team' | 'link' | 'public';
  status: 'draft' | 'published' | 'archived';
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory database
class Database {
  private users: Map<string, User> = new Map();
  private enterprises: Map<string, Enterprise> = new Map();
  private knowledge: Map<string, KnowledgeEntry> = new Map();

  constructor() {
    this.seedData();
  }

  // Seed initial data
  private seedData() {
    // Create test enterprise
    const enterpriseId = 'ent_test';
    const enterprise: Enterprise = {
      id: enterpriseId,
      name: '测试公司',
      industry: 'technology',
      size: '11-50',
      description: '这是一家测试公司',
      slug: 'test-company',
      planType: 'free',
      apiKeys: {},
      settings: {
        publicEnabled: false,
        welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.enterprises.set(enterpriseId, enterprise);

    // Create test user
    const userId = 'user_test';
    const hashedPassword = bcrypt.hashSync('12345678', 10);
    const user: User = {
      id: userId,
      email: 'test@example.com',
      password: hashedPassword,
      name: '测试用户',
      role: 'admin',
      enterpriseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(userId, user);

    // Create sample knowledge entries
    const knowledgeEntries: KnowledgeEntry[] = [
      {
        id: 'k1',
        enterpriseId,
        title: '公司简介',
        content: '我们是一家专注于AI技术的创新公司，致力于为企业提供智能知识管理解决方案。',
        contentType: 'guide',
        visibility: 'public',
        status: 'published',
        version: 1,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'k2',
        enterpriseId,
        title: '产品使用指南',
        content: '本指南将帮助您快速上手我们的产品。首先注册账号，然后选择行业，开始知识采集。',
        contentType: 'sop',
        visibility: 'team',
        status: 'published',
        version: 1,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'k3',
        enterpriseId,
        title: '常见问题解答',
        content: 'Q: 如何注册账号？\nA: 点击首页的注册按钮，填写邮箱、密码、公司名和行业即可。\n\nQ: 如何上传文档？\nA: 进入文档上传页面，拖拽或点击上传文件。',
        contentType: 'faq',
        visibility: 'public',
        status: 'published',
        version: 1,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    knowledgeEntries.forEach(entry => {
      this.knowledge.set(entry.id, entry);
    });
  }

  // User operations
  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = `user_${uuidv4().substr(0, 8)}`;
    const user: User = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  // Enterprise operations
  getEnterpriseById(id: string): Enterprise | undefined {
    return this.enterprises.get(id);
  }

  createEnterprise(data: Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt'>): Enterprise {
    const id = `ent_${uuidv4().substr(0, 8)}`;
    const enterprise: Enterprise = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.enterprises.set(id, enterprise);
    return enterprise;
  }

  updateEnterprise(id: string, data: Partial<Enterprise>): Enterprise | undefined {
    const enterprise = this.enterprises.get(id);
    if (!enterprise) return undefined;

    const updated = {
      ...enterprise,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.enterprises.set(id, updated);
    return updated;
  }

  // Knowledge operations
  getKnowledgeByEnterprise(enterpriseId: string, params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    contentType?: string;
    visibility?: string;
  }): { list: KnowledgeEntry[]; total: number } {
    let entries = Array.from(this.knowledge.values())
      .filter(k => k.enterpriseId === enterpriseId);

    // Apply filters
    if (params?.keyword) {
      const keyword = params.keyword.toLowerCase();
      entries = entries.filter(k =>
        k.title.toLowerCase().includes(keyword) ||
        k.content.toLowerCase().includes(keyword)
      );
    }

    if (params?.contentType) {
      entries = entries.filter(k => k.contentType === params.contentType);
    }

    if (params?.visibility) {
      entries = entries.filter(k => k.visibility === params.visibility);
    }

    // Sort by updatedAt desc
    entries.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      list: entries.slice(start, end),
      total: entries.length
    };
  }

  getKnowledgeById(id: string): KnowledgeEntry | undefined {
    return this.knowledge.get(id);
  }

  createKnowledge(data: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeEntry {
    const id = `k_${uuidv4().substr(0, 8)}`;
    const entry: KnowledgeEntry = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.knowledge.set(id, entry);
    return entry;
  }

  updateKnowledge(id: string, data: Partial<KnowledgeEntry>): KnowledgeEntry | undefined {
    const entry = this.knowledge.get(id);
    if (!entry) return undefined;

    const updated = {
      ...entry,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.knowledge.set(id, updated);
    return updated;
  }

  deleteKnowledge(id: string): boolean {
    return this.knowledge.delete(id);
  }

  // Statistics
  getStats(enterpriseId: string) {
    const knowledge = Array.from(this.knowledge.values())
      .filter(k => k.enterpriseId === enterpriseId);
    const users = Array.from(this.users.values())
      .filter(u => u.enterpriseId === enterpriseId);

    return {
      knowledgeCount: knowledge.length,
      memberCount: users.length,
      aiChatCount: 156, // Mock data
      adoptionRate: 78 // Mock data
    };
  }
}

// Export singleton instance
export const db = new Database();
