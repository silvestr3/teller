# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `bun run dev` (runs with watch mode)
- **Database migrations**: 
  - Generate: `bun run db:generate`
  - Apply: `bun run db:migrate`

Note: Database commands require a `.env` file with `DATABASE_URL` pointing to a PostgreSQL database.

## Architecture Overview

This is a financial API built with **Elysia** (Bun-native web framework) and **Drizzle ORM** with PostgreSQL database via Neon serverless.

### Technology Stack
- **Runtime**: Bun
- **Web Framework**: Elysia v1.4.9
- **Database**: PostgreSQL (via @neondatabase/serverless)
- **ORM**: Drizzle ORM with snake_case naming convention
- **Validation**: Zod for environment variables
- **TypeScript**: ES2022 modules with strict mode

### Project Structure
```
src/
├── index.ts              # Main application entry point (Elysia server)
├── env/
│   └── index.ts          # Environment validation with Zod schema
└── database/
    ├── client.ts         # Drizzle database client configuration
    ├── schema/
    │   ├── index.ts      # Exports all schemas
    │   └── income-schema.ts  # Income table definition
    └── migrations/       # Drizzle auto-generated migrations
```

### Database Schema Design
- Uses UUIDv7 for primary keys (via Bun's randomUUIDv7)
- Snake case column naming enforced by Drizzle config
- Current schema includes income tracking with user associations

### Environment Configuration
Required environment variables (validated via Zod):
- `NODE_ENV`: development|production|test (defaults to development)
- `PORT`: Server port (defaults to 3333)
- `DATABASE_URL`: PostgreSQL connection string (must start with postgresql://)

### Import Aliases
- `@/*` maps to `./src/*` for clean imports

### Key Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm** + **drizzle-kit**: Type-safe ORM and migration tool
- **elysia**: High-performance web framework for Bun
- **zod**: Runtime type validation