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
- Financial amounts: Use `decimal({ precision: 10, scale: 2 })` with `.$type<number>()` for type-safe number handling

**Module Structure Pattern**:

Each API module follows this structure (example: incomes):

```
packages/api/src/modules/incomes/
├── index.ts      # Elysia router with endpoints
├── service.ts    # Business logic layer
└── model.ts      # TypeBox schemas (optional)
```

**Example Module Implementation**:

1. **Database Schema** (`packages/api/src/database/schema/incomes.ts`):
```typescript
export const incomes = pgTable("incomes", {
  id: text().primaryKey().notNull().$defaultFn(() => randomUUIDv7()),
  userId: text().notNull().references(() => users.id, { onDelete: "cascade" }),
  description: varchar().notNull(),
  amount: decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
  date: date().notNull(),
  isRecurring: boolean().notNull().default(false),
});
```

2. **Service Layer** (`packages/api/src/modules/incomes/service.ts`):
```typescript
export abstract class IncomeService {
  static async findAll({ userId }: { userId: string }) {
    return await db.query.incomes.findMany({
      where: eq(schema.incomes.userId, userId),
      columns: { userId: false }, // Exclude sensitive fields
    });
  }

  static async create(input: CreateIncomeInput) {
    const [income] = await db.insert(schema.incomes)
      .values(input)
      .returning();
    return income;
  }
}
```

3. **Router/Controller** (`packages/api/src/modules/incomes/index.ts`):
```typescript
import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

export const incomesModule = new Elysia({ prefix: "/incomes" })
  .use(betterAuthPlugin)
  .get("/", async ({ user }) => {
    return await IncomeService.findAll({ userId: user.id });
  }, {
    auth: true,
    detail: { operationId: "getIncomes", tags: ["Incomes"] }
  })
  .post("/", async ({ user, body }) => {
    return await IncomeService.create({ userId: user.id, ...body });
  }, {
    auth: true,
    body: t.Object({
      description: t.String({ minLength: 1 }),
      amount: t.Number({ minimum: 0.01 }),
      date: t.String(),
      isRecurring: t.Optional(t.Boolean()),
    }),
    detail: { operationId: "createIncome", tags: ["Incomes"] }
  });
```

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
- **API Calls**: Eden Treaty via `apiClient` (see [packages/web/src/lib/api-client.ts](packages/web/src/lib/api-client.ts))
- **Data Fetching**: React Query hooks wrapping Eden Treaty calls in `packages/web/src/api/` directory
- **Forms**: React Hook Form + Zod validation (see income dialog for reference)
- **Data Tables**: TanStack Table via reusable `DataTable` component
- **Tabs**: Reusable `CustomTabs` component for consistent interfaces
- **Theming**: next-themes provider for dark/light mode
- **Sidebar**: shadcn/ui sidebar system with Cmd/Ctrl+B toggle
- **React Compiler**: Enabled - avoid manual memoization unless necessary
- **Import Alias**: `@/` maps to `src/`

**API Integration Pattern**:

Frontend API calls follow this structure (example: incomes):

```
packages/web/src/api/incomes/
├── get-incomes.ts     # Query hook for fetching data
├── create-income.ts   # Mutation hook for creating
├── update-income.ts   # Mutation hook for updating
└── delete-income.ts   # Mutation hook for deleting
```

**Example Hook Implementation**:

1. **Query Hook** (`packages/web/src/api/incomes/get-incomes.ts`):
```typescript
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

const getIncomes = async () => {
  const { data, error } = await apiClient.incomes.get();
  if (error) throw new Error(error.value.message);
  return data;
};

export const useGetIncomes = () => {
  return useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
  });
};
```

2. **Mutation Hook** (`packages/web/src/api/incomes/create-income.ts`):
```typescript
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateIncomeInput {
  description: string;
  amount: number;
  date: string;
  isRecurring?: boolean;
}

const createIncome = async (input: CreateIncomeInput) => {
  const { data, error } = await apiClient.incomes.post(input);
  if (error) throw new Error(error.value.message);
  return data;
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};
```

3. **Usage in Components**:
```typescript
// Fetching data
const { data: incomes, isLoading } = useGetIncomes();

// Creating data
const createMutation = useCreateIncome();

async function handleSubmit(formData: FormData) {
  await createMutation.mutateAsync({
    description: formData.description,
    amount: formData.amount,
    date: formData.date,
    isRecurring: formData.isRecurring ?? false,
  });
}
```

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

**Adding New Features (Full-Stack)**:

When adding a new feature (e.g., expenses, investments), follow this workflow:

1. **Database Schema** (`packages/api/src/database/schema/[feature].ts`):
   - Define table with proper column types
   - Use `decimal({ precision: 10, scale: 2 }).$type<number>()` for money
   - Add foreign key to `users` table with cascade delete
   - Export schema and add to `packages/api/src/database/schema/index.ts`

2. **Generate Migration**:
   ```bash
   bun run db:generate  # Creates migration file
   bun run db:migrate   # Applies migration to database
   ```

3. **API Module** (`packages/api/src/modules/[feature]/`):
   - Create `service.ts` with business logic (static methods)
   - Create `index.ts` with Elysia router and endpoints
   - Use `betterAuthPlugin` and `auth: true` for protected routes
   - Define request/response schemas with Elysia's `t` validators
   - Mount module in main app (`packages/api/src/index.ts`)

4. **Frontend API Hooks** (`packages/web/src/api/[feature]/`):
   - Create query hooks (e.g., `get-[feature].ts`) using `useQuery`
   - Create mutation hooks (e.g., `create-[feature].ts`) using `useMutation`
   - Always invalidate relevant queries in `onSuccess` callbacks
   - Types are automatically inferred from backend via Eden Treaty

5. **UI Components** (`packages/web/src/pages/(app)/[feature]/`):
   - Create page component with data fetching hooks
   - Create dialog/form components for create/edit operations
   - Use React Hook Form + Zod for form validation
   - Use `DataTable` component for displaying lists

**Example: Adding a New Module**:
```bash
# Backend
packages/api/src/database/schema/expenses.ts
packages/api/src/modules/expenses/service.ts
packages/api/src/modules/expenses/index.ts

# Frontend
packages/web/src/api/expenses/get-expenses.ts
packages/web/src/api/expenses/create-expense.ts
packages/web/src/pages/(app)/expenses/index.tsx
packages/web/src/pages/(app)/expenses/components/expense-dialog.tsx
```

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
