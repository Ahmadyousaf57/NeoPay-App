# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo (React Native) with expo-router

## Artifacts

- **Banking App** (`artifacts/mobile`) — Expo mobile app at `/`
- **API Server** (`artifacts/api-server`) — Express API at `/api`

## Features

### Authentication
- Signup with name, email, password → stored in PostgreSQL `users` table (bcrypt hashed)
- Login with email + password → returns JWT token
- Biometric login (Fingerprint / Face ID) via `expo-local-authentication`; credentials stored in `expo-secure-store`
- Session persisted in SecureStore (native) / AsyncStorage (web)
- JWT auth with `SESSION_SECRET` env var

### Banking App Screens
- **Home** — balance summary, bank cards, quick actions, recent transactions
- **Cards** — card details, spending breakdown
- **Activity** — full transaction history with search & filters
- **Profile** — settings, biometric toggle, sign out
- **Transfer** — send money with contact picker & animated success state

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
