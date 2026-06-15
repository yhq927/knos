// Shared database module
const users = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: '测试用户',
    role: 'admin',
    enterpriseId: 'ent_test',
    createdAt: new Date().toISOString()
  }
};

const enterprises = {
  'ent_test': {
    id: 'ent_test',
    name: '测试公司',
    industry: 'technology',
    size: '11-50',
    slug: 'test-company',
    planType: 'free',
    status: 'active',
    settings: { publicEnabled: false, welcomeMessage: '您好，我是您的智能助手' },
    createdAt: new Date().toISOString()
  }
};

const knowledge = {
  'k1': {
    id: 'k1',
    enterpriseId: 'ent_test',
    title: '公司简介',
    content: '我们是一家专注于AI技术的创新公司',
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
    content: '本指南将帮助您快速上手我们的产品',
    contentType: 'sop',
    visibility: 'team',
    status: 'published',
    version: 1,
    createdBy: 'user_test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

const businessUnits = {
  'bu1': { id: 'bu1', enterpriseId: 'ent_test', name: '技术部', description: '产品研发', status: 'active', createdAt: new Date().toISOString() },
  'bu2': { id: 'bu2', enterpriseId: 'ent_test', name: '市场部', description: '市场推广', status: 'active', createdAt: new Date().toISOString() }
};

const fileUploads = {};
const conversations = {};
const messages = {};

module.exports = { users, enterprises, knowledge, businessUnits, fileUploads, conversations, messages };
