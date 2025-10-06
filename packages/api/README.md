# @teller/api

The backend API for Teller - a modern financial tracking application.

## 🏗️ Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia v1.4.9 - Fast and friendly web framework
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with email/password support
- **Validation**: Zod for environment variables and request validation
- **API Documentation**: OpenAPI with Scalar UI

## 🚀 Getting Started

### Prerequisites

- Bun v1.2+
- PostgreSQL database

### Installation

From the monorepo root:

```bash
# Install dependencies
bun install

# Navigate to API package
cd packages/api

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=postgresql://user:password@localhost:5432/teller
CLIENT_URL=http://localhost:5173
```

### Database Setup

```bash
# Generate migrations (after modifying schemas)
bun run db:generate

# Apply migrations
bun run db:migrate
```

### Development

```bash
# Start dev server with watch mode
bun run dev

# The API will be available at http://localhost:3333
# OpenAPI docs at http://localhost:3333/docs
```

## 📁 Project Structure

```
src/
├── database/
│   ├── client.ts              # Drizzle database client
│   ├── schema/
│   │   ├── users.ts          # User schema
│   │   ├── sessions.ts       # Session schema
│   │   ├── accounts.ts       # Account schema
│   │   ├── verifications.ts  # Verification schema
│   │   ├── incomes.ts        # Income tracking schema
│   │   └── index.ts          # Schema exports
│   └── migrations/            # Drizzle migrations
│
├── http/
│   └── plugins/
│       └── better-auth.ts    # Better Auth Elysia plugin
│
├── lib/
│   └── auth.ts               # Better Auth configuration
│
├── env/
│   └── index.ts              # Environment validation
│
├── index.ts                  # Main application entry
└── types.ts                  # Exported types for frontend
```

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start dev server with watch mode

# Database
bun run db:generate  # Generate migration from schema changes
bun run db:migrate   # Apply pending migrations

# Code Quality
bun run lint         # Run Biome linter
bun run format       # Format code with Biome
bun run check        # Run Biome check (lint + format)
```

## 🔐 Authentication

This API uses **Better Auth** with the following configuration:

- **Method**: Email & password
- **Auto Sign-in**: Enabled
- **Password Hashing**: Bun's native `Bun.password.hash/verify`
- **Session Duration**: 7 days
- **Cookie Cache**: 5 minutes

### Protected Routes

Use the `auth` macro to protect routes:

```typescript
app.get('/protected', ({ auth }) => {
  return { user: auth.user };
}, {
  auth: true // Requires authentication
});
```

## 💾 Database

### Schema Conventions

- **Primary Keys**: UUIDv7 (via `Bun.randomUUIDv7()`)
- **Naming**: snake_case for columns
- **Tables**: Plural names (e.g., `users`, `incomes`)

### Better Auth Tables

These are automatically managed by Better Auth:

- `users` - User accounts
- `sessions` - Active sessions
- `accounts` - OAuth accounts (if enabled)
- `verifications` - Email verification tokens

### Adding New Tables

1. Create schema file in `src/database/schema/`
2. Export from `src/database/schema/index.ts`
3. Generate migration: `bun run db:generate`
4. Review SQL in `src/database/migrations/`
5. Apply migration: `bun run db:migrate`

Example schema:

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: uuid('id').primaryKey().$defaultFn(() => Bun.randomUUIDv7()),
  name: text('name').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
```

## 🔗 Type Safety with Eden Treaty

This API exports its types for the frontend via Eden Treaty:

```typescript
// src/index.ts
export const app = new Elysia()...
export type App = typeof app;
```

The frontend can then import these types:

```typescript
// In @teller/web
import type { App } from '@teller/api';
import { treaty } from '@elysiajs/eden';

const api = treaty<App>('http://localhost:3333');
```

## 📚 API Documentation

Once the server is running, visit:

- **OpenAPI Docs**: http://localhost:3333/docs
- **Better Auth Endpoints**: Automatically documented at `/docs`

### Main Endpoints

- `GET /` - Health check
- `POST /auth/sign-in/email` - Email/password sign in
- `POST /auth/sign-up/email` - User registration
- `POST /auth/sign-out` - Sign out
- `GET /auth/session` - Get current session

## 🛠️ Development Tips

### Hot Reload

The dev server uses Bun's `--watch` flag for automatic reloading on file changes.

### Database Connection

Uses `postgres` package with connection pooling. Configure connection string in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### CORS Configuration

CORS is configured to allow requests from `CLIENT_URL` (frontend):

```typescript
cors({
  origin: env.CLIENT_URL,
  credentials: true,
})
```

## 🚢 Deployment

### Build

Elysia runs directly with Bun - no build step needed:

```bash
bun run src/index.ts
```

### Environment

Ensure these environment variables are set in production:

- `NODE_ENV=production`
- `DATABASE_URL` - Production database URL
- `CLIENT_URL` - Production frontend URL
- `PORT` - Server port (optional, defaults to 3333)

## 📖 Further Reading

- [Elysia Documentation](https://elysiajs.com)
- [Better Auth Documentation](https://www.better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Bun Documentation](https://bun.sh/docs)
