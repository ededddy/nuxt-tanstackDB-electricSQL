# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun run dev` - Start the Nuxt development server
- `bun run build` - Build the application for production
- `npx eslint .` - Run ESLint to check code quality

## Architecture Overview

This is a Nuxt 4 application implementing a real-time sync architecture using ElectricSQL and TanStack DB. The app demonstrates bi-directional data synchronization between a local-first frontend and a PostgreSQL backend.

### Tech Stack

- **Frontend**: Nuxt 4 with Vue 3, TanStack Vue DB for local-first queries
- **Backend**: Nuxt server routes with Drizzle ORM
- **Database**: PostgreSQL (Neon) with ElectricSQL for change data capture
- **Validation**: Zod schemas auto-generated from Drizzle schema

### Core Data Flow

The application uses a unique architecture where the frontend maintains a local replica of server data:

1. **Initial Sync**: Frontend fetches shape data from ElectricSQL via `/api/electric` (proxy to Electric's `/v1/shape` endpoint)
2. **Local State**: TanStack DB collections store this data locally with reactive queries (`useLiveQuery`)
3. **Mutations**: Client-side changes go through collection lifecycle hooks (`onInsert`, `onUpdate`, `onDelete`)
4. **Backend Persistence**: Hooks call REST API endpoints (`/api/todos`) which persist to PostgreSQL via Drizzle
5. **Change Capture**: ElectricSQL captures PostgreSQL changes and streams them back to clients

### Key Architecture Files

- **`lib/collections.ts`**: Defines TanStack DB collections with ElectricSQL integration. Collection hooks handle mutation persistence to the backend API.
- **`lib/api.ts`**: Type-safe API client functions for CRUD operations against server endpoints.
- **`lib/db/index.ts`**: Drizzle database instance connected to Neon PostgreSQL.
- **`lib/db/schema.ts`**: Drizzle schema definitions using `pgSchema` for namespaced tables (schema: `test`, table: `test_table`).
- **`lib/db/validation.ts`**: Zod validation schemas auto-generated from Drizzle schema. Includes custom validation logic (e.g., rejecting "really hard todo" descriptions).
- **`server/api/electric.get.ts`**: Proxy endpoint that forwards requests to ElectricSQL's shape API, injecting authentication from environment variables.
- **`server/api/todos/*.ts`**: REST API endpoints for CRUD operations. All mutations use database transactions to generate transaction IDs via `pg_current_xact_id()`.
- **`server/utils/generateTxId.ts`**: Utility to extract PostgreSQL transaction IDs for ElectricSQL synchronization.
- **`app/app.vue`**: Root component using `useLiveQuery` to reactive-query local TanStack DB data.

### Code Style

- ESLint configured with 4-space indentation
- TypeScript strict mode enabled
- Zod v4 import syntax: `import type { z } from "zod/v4"`
- Nuxt tildem imports: `~~/` for project root imports

### Environment Variables

Required environment variables (see `.env` or set externally):
- `NEON_URL` - PostgreSQL connection string (Neon database)
- `POSTGRES_DATABASE` - Database name
- `ELECTRIC_URL` - ElectricSQL instance URL
- `ELECTRIC_SOURCE_ID` - ElectricSQL source identifier
- `ELECTRIC_SOURCE_SECRET` - ElectricSQL authentication secret

### Database Schema

The main table is `test.test_table` in PostgreSQL with the following structure:
- `id`: Auto-incrementing integer primary key
- `name`: varchar(255)
- `description`: text
- `version`: bigint (for optimistic locking/conflict resolution)
- `createdAt`: timestamp with timezone
- `updatedAt`: timestamp with timezone
- `completed`: boolean with default false
