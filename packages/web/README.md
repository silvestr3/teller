# @teller/web

The frontend web application for Teller - a modern financial tracking application built with React 19.

## 🏗️ Tech Stack

- **Framework**: React 19 with React Compiler
- **Build Tool**: Vite (using Rolldown)
- **Router**: React Router 7
- **State Management**: TanStack Query v5
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Data Tables**: TanStack Table
- **Charts**: Recharts
- **Auth**: Better Auth React client
- **API Client**: Eden Treaty (type-safe)
- **Theme**: next-themes (dark/light mode)

## 🚀 Getting Started

### Prerequisites

- Bun v1.2+
- Running API server (see `@teller/api`)

### Installation

From the monorepo root:

```bash
# Install dependencies
bun install

# Navigate to web package
cd packages/web

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3333
```

### Development

```bash
# Start dev server
bun run dev

# The app will be available at http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   └── global/               # Reusable components
│       ├── data-table.tsx    # TanStack Table wrapper
│       ├── custom-tabs.tsx   # Custom tabs component
│       └── form-error.tsx    # Form error display
│
├── pages/                    # Route pages
│   ├── (app)/               # Authenticated routes
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expenses/
│   │   └── investments/
│   ├── (auth)/              # Auth routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── not-found/
│
├── layout/                   # Layout components
│   ├── home-layout/         # Main app layout with sidebar
│   └── auth-layout/         # Authentication layout
│
├── hooks/                    # Custom React hooks
│   └── use-mobile.ts
│
├── lib/                      # Utilities & clients
│   ├── api-client.ts        # Eden Treaty client (future)
│   ├── auth-client.ts       # Better Auth client
│   ├── query-client.ts      # TanStack Query config
│   └── utils.ts             # Utility functions
│
├── context/                  # React contexts
│   └── theme-provider.tsx   # Theme provider
│
├── router/                   # React Router config
│   └── index.tsx
│
├── types/                    # TypeScript types
│   ├── income.ts
│   └── payment.ts
│
├── env/                      # Environment validation
│   └── index.ts
│
├── styles/                   # Global styles
│   └── index.css
│
└── main.tsx                  # App entry point
```

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start dev server with HMR

# Build
bun run build        # Build for production

# Preview
bun run preview      # Preview production build

# Code Quality
bun run lint         # Run Biome linter
bun run format       # Format code with Biome
```

## 🎨 UI Components

This app uses **shadcn/ui** components built on top of Radix UI primitives.

### Adding New Components

```bash
# Use shadcn CLI to add components
npx shadcn@latest add button
npx shadcn@latest add dialog
# etc.
```

Components are added to `src/components/ui/` and can be customized.

### Component Library

Key components include:

- **Button** - Various button styles and sizes
- **Dialog** - Modal dialogs
- **Table** - Data tables with TanStack Table
- **Sidebar** - App navigation sidebar (Cmd/Ctrl+B to toggle)
- **Card** - Content containers
- **Form** - Form components with validation
- **Theme Toggle** - Dark/light mode switcher

## 🔐 Authentication

This app uses **Better Auth** React client for authentication:

```typescript
import { auth } from '@/lib/auth-client';

// Sign in
await auth.signIn.email({
  email: 'user@example.com',
  password: 'password',
});

// Get session
const { data: session } = await auth.getSession();

// Sign out
await auth.signOut();
```

### Protected Routes

Routes under `(app)/` require authentication. React Router loaders check for sessions:

```typescript
loader: async () => {
  const { data: session } = await auth.getSession();
  if (!session) {
    throw redirect('/auth/sign-in');
  }
  return session;
}
```

## 📊 Data Fetching

Uses **TanStack Query** for server state management:

```typescript
import { useQuery } from '@tanstack/react-query';

function useIncomes() {
  return useQuery({
    queryKey: ['incomes'],
    queryFn: async () => {
      const response = await fetch(`${env.VITE_API_URL}/incomes`);
      return response.json();
    },
  });
}
```

### Eden Treaty (Future)

Once configured, you'll use the type-safe API client:

```typescript
import { api } from '@/lib/api-client';

const { data, error } = await api.incomes.get();
// Fully typed with autocomplete!
```

## 🎯 Key Patterns

### Page Structure

Pages follow this pattern:

```
src/pages/(app)/feature/
├── index.tsx              # Main page component
└── components/            # Page-specific components
    ├── feature-dialog.tsx
    └── feature-table.tsx
```

### Forms

Forms use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  // ...
}
```

### Data Tables

Use the reusable `DataTable` component:

```typescript
import { DataTable } from '@/components/global/data-table';

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

<DataTable columns={columns} data={items} />
```

### Tabs

Use `CustomTabs` for consistent tab interfaces:

```typescript
import { CustomTabs } from '@/components/global/custom-tabs';

<CustomTabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <Content1 /> },
    { id: 'tab2', label: 'Tab 2', content: <Content2 /> },
  ]}
/>
```

## 🌙 Theming

The app supports dark/light mode using `next-themes`:

```typescript
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## ⚡ React Compiler

This project uses the **experimental React Compiler**:

- Automatic memoization
- Avoid manual `useMemo`, `useCallback`, `memo` unless necessary
- See [React Compiler docs](https://react.dev/learn/react-compiler)

## 🎨 Styling

### Tailwind CSS 4

Uses Tailwind CSS 4 with:

- Custom color palette
- Dark mode support
- CSS variables for theming
- Custom utility classes

### Import Alias

Use `@/` to import from `src/`:

```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

## 🚢 Deployment

### Build

```bash
bun run build
```

Output will be in `dist/` directory.

### Environment

Set `VITE_API_URL` to your production API URL:

```env
VITE_API_URL=https://api.your-domain.com
```

### Deploy

The built app is a static SPA. Deploy to:

- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting

## 📖 Further Reading

- [React 19 Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
