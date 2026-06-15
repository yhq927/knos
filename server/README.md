# KnosAI 后端服务

## 快速开始

### 安装依赖
```bash
cd server
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
npm start
```

## API 端点

### 认证相关
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户（需要认证）

### 企业管理
- `GET /api/enterprise` - 获取企业信息
- `PUT /api/enterprise` - 更新企业信息
- `GET /api/enterprise/stats` - 获取企业统计

### 知识库管理
- `GET /api/knowledge` - 获取知识列表
- `GET /api/knowledge/:id` - 获取知识详情
- `POST /api/knowledge` - 创建知识条目
- `PUT /api/knowledge/:id` - 更新知识条目
- `DELETE /api/knowledge/:id` - 删除知识条目

### 成员管理
- `GET /api/members` - 获取成员列表
- `POST /api/members/invite` - 邀请成员
- `PUT /api/members/:id/role` - 更新成员角色
- `DELETE /api/members/:id` - 移除成员

### 数据分析
- `GET /api/analytics/overview` - 获取概览统计
- `GET /api/analytics/hot` - 获取热门问题
- `GET /api/analytics/uncovered` - 获取未覆盖问题
- `GET /api/analytics/ranking` - 获取用户排行

## 测试账号

- 邮箱: `test@example.com`
- 密码: `12345678`

## 环境变量

复制 `.env.example` 到 `.env` 并修改配置：

```env
PORT=4000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```
