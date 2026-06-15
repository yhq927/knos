import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'knosai-secret-key-2024';

// 用户数据
const users: Record<string, any> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: bcrypt.hashSync('12345678', 10),
    name: '测试用户',
    role: 'admin',
    enterpriseId: 'ent_test',
    createdAt: new Date().toISOString()
  }
};

// 企业数据
const enterprises: Record<string, any> = {
  'ent_test': {
    id: 'ent_test',
    name: '测试公司',
    industry: 'technology',
    size: '11-50',
    slug: 'test-company',
    planType: 'free',
    status: 'active',
    settings: {
      publicEnabled: false,
      welcomeMessage: '您好，我是您的智能助手，请问您想了解什么？'
    },
    createdAt: new Date().toISOString()
  }
};

// 知识库数据
const knowledge: Record<string, any> = {
  'k1': {
    id: 'k1',
    enterpriseId: 'ent_test',
    title: '公司简介',
    content: '我们是一家专注于AI技术的创新公司，致力于为企业提供智能知识管理解决方案。',
    contentType: 'guide',
    visibility: 'public',
    status: 'published',
    version: 1,
    createdBy: 'user_test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'k2': {
    id: 'k2',
    enterpriseId: 'ent_test',
    title: '产品使用指南',
    content: '本指南将帮助您快速上手我们的产品。首先注册账号，然后选择行业，开始知识采集。',
    contentType: 'sop',
    visibility: 'team',
    status: 'published',
    version: 1,
    createdBy: 'user_test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'k3': {
    id: 'k3',
    enterpriseId: 'ent_test',
    title: '常见问题解答',
    content: 'Q: 如何注册账号？\nA: 点击首页的注册按钮，填写邮箱、密码、公司名和行业即可。\n\nQ: 如何上传文档？\nA: 进入文档上传页面，拖拽或点击上传文件。',
    contentType: 'faq',
    visibility: 'public',
    status: 'published',
    version: 1,
    createdBy: 'user_test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// 业务单元数据
const businessUnits: Record<string, any> = {
  'bu1': {
    id: 'bu1',
    enterpriseId: 'ent_test',
    name: '技术部',
    description: '负责产品研发',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  'bu2': {
    id: 'bu2',
    enterpriseId: 'ent_test',
    name: '市场部',
    description: '负责市场推广',
    status: 'active',
    createdAt: new Date().toISOString()
  }
};

// 文件上传数据
const fileUploads: Record<string, any> = {};

// 辅助函数
export const getUserByEmail = (email: string) => users[email];
export const getUserById = (id: string) => Object.values(users).find((u: any) => u.id === id);
export const getEnterpriseById = (id: string) => enterprises[id];
export const getKnowledgeByEnterprise = (enterpriseId: string) => 
  Object.values(knowledge).filter((k: any) => k.enterpriseId === enterpriseId);
export const getBusinessUnitsByEnterprise = (enterpriseId: string) =>
  Object.values(businessUnits).filter((bu: any) => bu.enterpriseId === enterpriseId);

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
};

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export { JWT_SECRET, users, enterprises, knowledge, businessUnits, fileUploads };
