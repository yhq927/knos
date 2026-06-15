# KnosAI - Enterprise Knowledge Management Platform

An AI-powered knowledge management platform that helps enterprises capture, organize, and query team knowledge through AI-guided Q&A, document parsing, and intelligent search.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Ant Design 5 + Zustand + Vite
- **Backend**: Vercel Serverless Functions (Node.js)
- **Storage**: In-memory (dev) / Vercel KV - Upstash Redis (production)
- **Auth**: JWT-based authentication

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server (port 3000)
npm run dev

# In another terminal, start API server (port 3001)
npx vercel dev --port 3001
```

> The frontend proxies `/api/*` requests to `localhost:3001` via Vite proxy.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Enterprise User | `test@example.com` | `12345678` |
| Platform Admin | `admin` | `admin123` |

## Project Structure

```
knosai/
├── api/                    # Vercel Serverless Functions
│   ├── _lib/               # Shared utilities
│   │   ├── auth.js         # JWT auth (sign, verify, hash)
│   │   ├── models.js       # Data access layer
│   │   ├── response.js     # Unified response helpers
│   │   ├── seed.js         # Demo data seeding
│   │   └── storage.js      # Storage abstraction (memory + KV)
│   ├── auth/               # Login, register, me, logout, refresh, forgot/reset password
│   ├── admin/              # Platform admin APIs
│   ├── analytics/          # Usage analytics
│   ├── billing/            # Plan & usage
│   ├── business-units/     # Business unit CRUD
│   ├── chat/               # AI Q&A (sync + SSE streaming + feedback)
│   ├── collect/            # Knowledge collection (guided Q&A)
│   ├── enterprise/         # Enterprise info & settings
│   ├── knowledge/          # Knowledge CRUD + versioning
│   ├── members/            # Team member management
│   ├── notifications/      # Notification center
│   ├── public/             # Public-facing chat widget API
│   └── upload/             # File upload & parsing
├── src/
│   ├── components/         # Shared components (AuthRoute, ErrorBoundary, Layout)
│   ├── constants/          # Shared constants
│   ├── pages/              # Route pages
│   ├── services/           # Axios API client
│   ├── stores/             # Zustand stores (auth)
│   ├── styles/             # Global CSS
│   └── types/              # TypeScript interfaces
├── vercel.json             # Vercel routing config
├── vite.config.ts          # Vite build config
└── package.json
```

## Environment Variables

See `.env.example` for all available configuration.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `/api` | API base URL |
| `JWT_SECRET` | **Yes** | `knosai-dev-secret-...` | JWT signing secret |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiry duration |
| `ALLOWED_ORIGIN` | No | `*` | CORS allowed origin |
| `KV_REST_API_URL` | No | - | Vercel KV URL (enables persistent storage) |
| `KV_REST_API_TOKEN` | No | - | Vercel KV token |

> Without KV configured, the backend uses in-memory storage (data resets on cold start).

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables (`JWT_SECRET`, optionally `KV_REST_API_URL` + `KV_REST_API_TOKEN`)
4. Deploy

## Key Features

- **AI-Guided Knowledge Collection**: AI proactively asks questions to capture tacit knowledge
- **Document Parsing**: Upload Word/PDF/Excel/Markdown files, auto-extract knowledge
- **AI Q&A**: Chat with AI based on enterprise knowledge base, with source citations and confidence scores
- **Version Control**: Full knowledge version history with rollback
- **Team Management**: Role-based access (admin/editor/viewer)
- **Public Widget**: Embed AI chat on your website for customer-facing Q&A
- **Analytics**: Usage stats, hot questions, uncovered gaps, user rankings
- **Dark Theme**: Modern dark UI throughout

## License

MIT
