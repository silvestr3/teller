# 💰 Teller

A modern financial tracking application for seamless money management.

## 🏗️ Architecture

This is a **Bun workspace monorepo** with end-to-end type safety powered by Eden Treaty.

### Packages

- **[@teller/api](packages/api)** - Backend API built with Elysia, Drizzle ORM, and PostgreSQL
- **[@teller/web](packages/web)** - Frontend web app built with React 19, Vite, and TanStack Query

## ✨ Features

- 🔐 **Secure Authentication** - Better Auth with email/password
- 📊 **Financial Tracking** - Manage income, expenses, and investments
- 🎯 **Type Safety** - End-to-end type safety with Eden Treaty
- 📱 **Responsive** - Mobile-first design approach

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.2+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd teller

# Install dependencies
bun install

# Set up environment variables
cp packages/api/.env.example packages/api/.env
cp packages/web/.env.example packages/web/.env

# Configure your database URL in packages/api/.env
# DATABASE_URL=postgresql://user:password@localhost:5432/teller

# Run database migrations
bun run db:migrate

# Start development servers (both API and web)
bun run dev
```

The API will be running at `http://localhost:3333` and the web app at `http://localhost:5173`.

## 📜 Available Scripts

### Root Commands

```bash
# Development
bun run dev          # Start both API and web dev servers
bun run dev:api      # Start API server only
bun run dev:web      # Start web app only

# Database
bun run db:generate  # Generate database migrations
bun run db:migrate   # Apply database migrations

# Code Quality
bun run lint         # Lint all packages
bun run format       # Format all packages

# Build
bun run build:web    # Build web app for production
```

### Package-Specific Commands

Navigate to individual packages for more commands:

```bash
cd packages/api && bun run dev      # API development
cd packages/web && bun run dev      # Web development
```

## 🛠️ Tech Stack

### Backend (`@teller/api`)

- **Runtime**: Bun
- **Framework**: Elysia
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: Better Auth
- **Validation**: Zod

### Frontend (`@teller/web`)

- **Framework**: React 19
- **Build Tool**: Vite (with Rolldown)
- **Router**: React Router 7
- **State Management**: TanStack Query
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Type Safety

- **Eden Treaty** - Automatic type inference from API to frontend
- **TypeScript** - Strict mode enabled across all packages

## 📁 Project Structure

```
teller/
├── packages/
│   ├── api/                      # Backend API
│   │   ├── src/
│   │   │   ├── database/        # Drizzle schemas & migrations
│   │   │   ├── http/            # Elysia plugins
│   │   │   ├── lib/             # Better Auth config
│   │   │   └── index.ts         # Main app entry
│   │   └── package.json
│   │
│   └── web/                      # Frontend app
│       ├── src/
│       │   ├── components/      # UI components
│       │   ├── pages/           # Route pages
│       │   ├── layout/          # Layout components
│       │   ├── hooks/           # React hooks
│       │   ├── lib/             # Utilities & clients
│       │   └── main.tsx         # App entry
│       └── package.json
│
├── package.json                  # Root workspace config
├── CLAUDE.md                     # AI assistant documentation
└── README.md                     # This file
```

## 🔧 Development

### Database Migrations

When you modify database schemas:

```bash
# 1. Edit schema files in packages/api/src/database/schema/
# 2. Generate migration
bun run db:generate

# 3. Review generated SQL in packages/api/src/database/migrations/
# 4. Apply migration
bun run db:migrate
```

### Adding New API Endpoints

1. Add routes to `packages/api/src/index.ts`
2. Types automatically flow to frontend via Eden Treaty
3. Use in frontend with full autocomplete:

```typescript
import { api } from '@/lib/api-client';

const { data } = await api.yourRoute.get();
```

### Environment Variables

#### API (`packages/api/.env`)

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=postgresql://user:password@localhost:5432/teller
CLIENT_URL=http://localhost:5173
```

#### Web (`packages/web/.env`)

```env
VITE_API_URL=http://localhost:3333
```

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Comprehensive codebase documentation
- **[API README](packages/api/README.md)** - Backend-specific docs
- **[Web README](packages/web/README.md)** - Frontend-specific docs

Built with ❤️ using Bun
