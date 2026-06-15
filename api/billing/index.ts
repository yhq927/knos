import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getEnterpriseById, getKnowledgeByEnterprise } from '../../_lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证Token' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ code: 401, message: 'Token无效' });
  }

  try {
    const enterprise = getEnterpriseById(decoded.enterpriseId);
    if (!enterprise) {
      return res.status(404).json({ code: 404, message: '企业不存在' });
    }

    const knowledgeList = getKnowledgeByEnterprise(decoded.enterpriseId);

    // GET /api/billing/plan - 获取套餐信息
    if (req.method === 'GET' && req.url?.includes('/plan')) {
      const planType = enterprise.planType || 'free';
      
      const plans: Record<string, any> = {
        free: {
          name: '免费版',
          price: 0,
          period: '永久',
          features: ['1个企业', '10个成员', '500条知识', '50次AI试用', '单文件20MB']
        },
        pro: {
          name: '专业版',
          price: 299,
          period: '月',
          features: ['不限成员', '不限知识', '1000次AI问答/月', '单文件100MB', '对外服务功能']
        },
        enterprise: {
          name: '企业版',
          price: 0,
          period: '面议',
          features: ['专业版全部功能', 'SSO单点登录', '私有部署', '专属客户经理']
        }
      };

      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          planType,
          ...plans[planType]
        }
      });
    }

    // GET /api/billing/usage - 获取使用量
    if (req.method === 'GET' && req.url?.includes('/usage')) {
      const planType = enterprise.planType || 'free';
      
      const limits: Record<string, any> = {
        free: {
          aiLimit: 50,
          storageLimit: 500, // MB
          memberLimit: 10,
          knowledgeLimit: 500
        },
        pro: {
          aiLimit: 1000,
          storageLimit: 10240, // 10GB
          memberLimit: -1, // unlimited
          knowledgeLimit: -1 // unlimited
        }
      };

      const limit = limits[planType] || limits.free;

      return res.status(200).json({
        code: 0,
        message: 'success',
        data: {
          aiUsed: 23,
          aiLimit: limit.aiLimit,
          storageUsed: 128,
          storageLimit: limit.storageLimit,
          memberCount: 5,
          memberLimit: limit.memberLimit,
          knowledgeCount: knowledgeList.length,
          knowledgeLimit: limit.knowledgeLimit
        }
      });
    }

    // POST /api/billing/upgrade - 升级套餐
    if (req.method === 'POST' && req.url?.includes('/upgrade')) {
      const { planType } = req.body;

      if (!planType || !['pro', 'enterprise'].includes(planType)) {
        return res.status(400).json({ code: 400, message: '无效的套餐类型' });
      }

      // 模拟升级成功
      enterprise.planType = planType;

      return res.status(200).json({
        code: 0,
        message: '升级成功',
        data: {
          planType,
          paymentUrl: `https://example.com/pay?plan=${planType}&enterprise=${enterprise.id}`
        }
      });
    }

    return res.status(404).json({ code: 404, message: 'Not found' });
  } catch (error) {
    console.error('Billing error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
}
