# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **teller** Bun workspace monorepo containing a financial tracking application with two main packages:
- **@teller/api**: Backend API built with Elysia (Bun runtime)
- **@teller/web**: Frontend web app built with React 19 + Vite

Both projects use **Better Auth** for authentication and **Eden Treaty** for end-to-end type-safe API communication.

## Monorepo Structure

```
teller/
├── packages/
│   ├── api/          # @teller/api - Backend API
│   └── web/          # @teller/web - Frontend app
├── package.json      # Root workspace configuration
└── CLAUDE.md         # This file
```

This is a **Bun workspace** - all packages use Bun as the runtime and package manager.

## Development Commands

### Root Commands (from monorepo root)
- **Dev (both)**: `bun run dev` - Starts both API and web dev servers
- **Dev API only**: `bun run dev:api`
- **Dev Web only**: `bun run dev:web`
- **Build web**: `bun run build:web`
- **Database migrations**:
  - Generate: `bun run db:generate`
  - Apply: `bun run db:migrate`
- **Lint all**: `bun run lint`
- **Format all**: `bun run format`

### Package-Specific Commands
Navigate to `packages/api` or `packages/web` to run package-specific commands:
- API: `bun run dev`, `bun run lint`, `bun run format`, `bun run check`
- Web: `bun run dev`, `bun run build`, `bun run lint`, `bun run format`

## Architecture Overview

### Type-Safe API Communication (Eden Treaty)

This monorepo uses **Eden Treaty** for end-to-end type safety between API and frontend:

**How it works**:
1. API exports its Elysia app type: `export type App = typeof app`
2. Web imports the type via workspace dependency: `import type { App } from '@teller/api'`
3. Eden Treaty client provides fully typed API calls with autocomplete

**Key Files**:
- [packages/api/src/index.ts](packages/api/src/index.ts): Exports `App` type
- [packages/web/src/lib/api-client.ts](packages/web/src/lib/api-client.ts): Eden Treaty client setup
- [packages/web/src/hooks/use-api.tsx](packages/web/src/hooks/use-api.tsx): Example hooks with React Query + Eden Treaty

**Usage Pattern**:
```typescript
import { api } from '@/lib/api-client';

// Fully typed - autocomplete for routes, params, body, response
const { data, error } = await api.incomes.get();
//     ^? { id: string, amount: number, ... }
```

**Integration with React Query**:
```typescript
const { data } = useQuery({
  queryKey: ['incomes'],
  queryFn: async () => {
    const { data, error } = await api.incomes.get();
    if (error) throw error;
    return data;
  },
});
```

### Authentication Flow

This application uses **Better Auth** for full-stack authentication:
- API: Mounts Better Auth handler at `/auth` path with email/password enabled
- Web: Uses Better Auth React client configured with `baseURL` pointing to API
- Sessions: 7-day expiry with 5-minute cookie cache
- Password hashing: Uses Bun's native `Bun.password.hash/verify`
- Database adapter: Drizzle with PostgreSQL (snake_case, plural tables)
- OpenAPI documentation: Better Auth endpoints auto-documented at `/docs`

**Auth Implementation Details**:
- API uses a macro (`betterAuthPlugin`) that provides `auth` resolver for protected routes
- Web uses React Router loaders to check session before rendering protected routes
- Protected routes redirect to `/auth/sign-in` if no session found
- Auth routes (`/auth/*`) redirect to `/` if already authenticated

### API Architecture (@teller/api)

**Stack**: Bun + Elysia + Drizzle ORM + PostgreSQL + Better Auth

**Key Files**:
- [packages/api/src/index.ts](packages/api/src/index.ts): Main Elysia app, exports `App` type for Eden Treaty
- [packages/api/src/lib/auth.ts](packages/api/src/lib/auth.ts): Better Auth configuration
- [packages/api/src/http/plugins/better-auth.ts](packages/api/src/http/plugins/better-auth.ts): Elysia plugin with auth macro for protected routes
- [packages/api/src/database/client.ts](packages/api/src/database/client.ts): Drizzle client with Postgres connection
- [packages/api/src/database/schema/](packages/api/src/database/schema/): Database schemas (users, sessions, accounts, verifications, incomes)
- [packages/api/src/env/index.ts](packages/api/src/env/index.ts): Environment validation with Zod

**Database Conventions**:
- UUIDv7 for primary keys (via `Bun.randomUUIDv7()`)
- Snake case column naming
- Plural table names
- Better Auth tables: `users`, `sessions`, `accounts`, `verifications`

**Environment Variables** (`.env` in packages/api):
- `NODE_ENV`: development|production|test
- `PORT`: Server port (default: 3333)
- `DATABASE_URL`: PostgreSQL connection string
- `CLIENT_URL`: Frontend URL for CORS

### Web Architecture (@teller/web)

**Stack**: React 19 + TypeScript + Vite (rolldown) + React Router 7 + TanStack Query + Tailwind CSS 4 + Better Auth + Eden Treaty

**Key Files**:
- [packages/web/src/main.tsx](packages/web/src/main.tsx): App entry point
- [packages/web/src/router/index.tsx](packages/web/src/router/index.tsx): React Router with auth loaders
- [packages/web/src/lib/api-client.ts](packages/web/src/lib/api-client.ts): Eden Treaty client (type-safe API calls)
- [packages/web/src/lib/auth-client.ts](packages/web/src/lib/auth-client.ts): Better Auth React client
- [packages/web/src/lib/query-client.ts](packages/web/src/lib/query-client.ts): TanStack Query client
- [packages/web/src/hooks/use-api.tsx](packages/web/src/hooks/use-api.tsx): Example React Query + Eden Treaty hooks
- [packages/web/src/env/index.ts](packages/web/src/env/index.ts): Environment validation

**Routing Structure**:
```
/ (HomeLayout - requires auth)
├── / (DashboardPage)
├── /income (IncomePage)
├── /expenses (placeholder)
└── /investments (placeholder)

/auth (AuthLayout - redirects if authenticated)
├── /auth/sign-in (SignInPage)
└── /auth/sign-up (SignUpPage)
```

**Component Organization**:
- [packages/web/src/components/ui/](packages/web/src/components/ui/): shadcn/ui primitives (Button, Dialog, Table, Sidebar, etc.)
- [packages/web/src/components/global/](packages/web/src/components/global/): Reusable components (DataTable, CustomTabs, FormError)
- [packages/web/src/pages/](packages/web/src/pages/): Route pages with co-located components in `components/` subfolders
- [packages/web/src/layout/](packages/web/src/layout/): Layout components (HomeLayout with sidebar, AuthLayout)

**Key Patterns**:
- **API Calls**: Eden Treaty via `api` client (see [packages/web/src/lib/api-client.ts](packages/web/src/lib/api-client.ts))
- **Data Fetching**: React Query hooks wrapping Eden Treaty calls (see [packages/web/src/hooks/use-api.tsx](packages/web/src/hooks/use-api.tsx))
- **Forms**: React Hook Form + Zod validation (see income dialog for reference)
- **Data Tables**: TanStack Table via reusable `DataTable` component
- **Tabs**: Reusable `CustomTabs` component for consistent interfaces
- **Theming**: next-themes provider for dark/light mode
- **Sidebar**: shadcn/ui sidebar system with Cmd/Ctrl+B toggle
- **React Compiler**: Enabled - avoid manual memoization unless necessary
- **Import Alias**: `@/` maps to `src/`

**Environment Variables** (`.env` in packages/web):
- `VITE_API_URL`: Backend API URL

## Development Workflow

1. **Start Database**: Ensure PostgreSQL is running (via Docker Compose if configured)
2. **Start Development**: Run `bun run dev` from root to start both API and web
   - API runs on port 3333 by default
   - Web runs on Vite's default port (5173)

**Database Migrations**:
1. Modify schema in [packages/api/src/database/schema/](packages/api/src/database/schema/)
2. Generate migration: `bun run db:generate` (from root)
3. Apply migration: `bun run db:migrate` (from root)

**Adding New API Endpoints**:
1. Add route to API (Elysia app)
2. Web automatically gets types via Eden Treaty - no codegen needed!
3. Create React Query hooks in `packages/web/src/hooks/` wrapping Eden Treaty calls

## Code Style

- **Both packages**: Use Biome for linting/formatting
- **API**: Configured in [packages/api/biome.json](packages/api/biome.json)
- **Web**: Configured in [packages/web/biome.json](packages/web/biome.json), semicolons "asNeeded", 2-space indentation
- Both follow TypeScript strict mode
- API uses Bun's native APIs when available (password hashing, UUIDv7, etc.)

## Workspace Dependencies

The web package imports the API as a workspace dependency:
- `"@teller/api": "workspace:*"` in `packages/web/package.json`
- Only types are imported (not runtime code)
- Enables end-to-end type safety via Eden Treaty
