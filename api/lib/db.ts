import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'knosai-secret-key-2024';

// Users database
const users: Record<string, any> = {
  'test@example.com': {
    id: 'user_test',
    email: 'test@example.com',
    password: '12345678',
    name: 'Test User',
    role: 'admin',
    enterpriseId: 'ent_test',
    createdAt: new Date().toISOString()
  }
};

// Enterprises database
const enterprises: Record<string, any> = {
  'ent_test': {
    id: 'ent_test',
    name: 'Test Company',
    industry: 'technology',
    size: '11-50',
    slug: 'test-company',
    planType: 'free',
    status: 'active',
    settings: { publicEnabled: false, welcomeMessage: 'Hello, how can I help you?' },
    createdAt: new Date().toISOString()
  }
};

// Knowledge database
const knowledge: Record<string, any> = {
  'k1': {
    id: 'k1',
    enterpriseId: 'ent_test',
    title: 'Company Introduction',
    content: 'We are an AI technology company focused on enterprise knowledge management.',
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
    title: 'Product Guide',
    content: 'This guide will help you get started with our product.',
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
    title: 'FAQ',
    content: 'Q: How to register?\nA: Click the register button on the homepage.\n\nQ: How to upload documents?\nA: Go to the upload page and drag files.',
    contentType: 'faq',
    visibility: 'public',
    status: 'published',
    version: 1,
    createdBy: 'user_test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Business units database
const businessUnits: Record<string, any> = {
  'bu1': {
    id: 'bu1',
    enterpriseId: 'ent_test',
    name: 'Engineering',
    description: 'Product development',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  'bu2': {
    id: 'bu2',
    enterpriseId: 'ent_test',
    name: 'Marketing',
    description: 'Marketing and sales',
    status: 'active',
    createdAt: new Date().toISOString()
  }
};

// File uploads database
const fileUploads: Record<string, any> = {};

// Helper functions
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
