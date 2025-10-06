# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `npm run dev` - Starts Vite dev server with HMR
- **Build**: `npm run build` - Runs TypeScript compiler and Vite build
- **Lint**: `npm run lint` - Runs Biome linter
- **Format**: `npm run format` - Runs Biome formatter
- **Preview**: `npm run preview` - Preview production build locally

## Architecture Overview

### Technology Stack
- **React 19** with TypeScript
- **Vite** (using rolldown-vite) with React Compiler enabled
- **React Router v7** for routing
- **TanStack Query** for server state management
- **TanStack Table** for data tables
- **Tailwind CSS v4** for styling
- **Radix UI** for headless component primitives
- **Zod** for schema validation
- **React Hook Form** for form handling
- **Biome** for linting and formatting (not ESLint)

### Project Structure

```
src/
├── components/
│   ├── ui/          # Radix-based UI primitives (Button, Dialog, Table, Sidebar, etc.)
│   └── global/      # Reusable components (DataTable, CustomTabs, FormError)
├── pages/           # Route pages with co-located components
│   ├── dashboard/   # Dashboard with charts, cards, and recent transactions
│   ├── income/      # Income tracking with recurring/one-time tabs
│   └── not-found/
├── layout/          # Layout components
│   └── home-layout/ # Main app layout with sidebar and header
├── router/          # React Router configuration
├── context/         # React context providers (ThemeProvider)
├── hooks/           # Custom hooks (use-mobile)
├── lib/             # Utilities (utils.ts, query-client.ts)
├── types/           # TypeScript type definitions (Income, Payment)
└── styles/          # Global CSS
```

### Key Patterns

**Component Organization**: Pages use a folder structure with co-located components. Each page has an `index.tsx` and a `components/` subfolder for page-specific components.

**Routing**: Centralized in `src/router/index.tsx`. Uses `createBrowserRouter` with `HomeLayout` as the parent route containing the sidebar. Main routes: `/` (dashboard), `/income`, `/expenses`, `/investments`.

**Data Tables**: Use the reusable `DataTable` component from `src/components/global/data-table.tsx` with TanStack Table. Define columns using `ColumnDef`.

**Forms**: Built with React Hook Form + Zod validation. See `src/pages/income/components/income-dialog.tsx` for the pattern.

**Tabs**: Use the reusable `CustomTabs` component from `src/components/global/custom-tabs.tsx` for consistent tab interfaces.

**Sidebar**: Built with shadcn/ui's sidebar system. The main layout (`src/layout/home-layout`) wraps content in `SidebarProvider`. Keyboard shortcut: Cmd/Ctrl+B to toggle.

**Theming**: Uses a theme provider (`src/context/theme-provider.tsx`) for dark/light mode. Toggle via `ThemeToggle` component.

**Styling**: Import path alias `@/` maps to `src/`. Tailwind v4 with custom utilities. Biome handles formatting with semicolons set to "asNeeded" and 2-space indentation.

### Domain Types

- **Income**: `{ id, description, amount, date }` - Can be recurring or one-time
- **Payment**: `{ id, amount, status, description, category }` - Used for expenses/transactions

### React Compiler

This project uses the experimental React Compiler (`babel-plugin-react-compiler`). Avoid manual memoization (`useMemo`, `useCallback`, `memo`) unless absolutely necessary.
