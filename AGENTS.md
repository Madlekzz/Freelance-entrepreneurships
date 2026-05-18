# AGENTS.md

## Monorepo Commands

```bash
pnpm dev          # Run frontend + backend concurrently
pnpm dev:front    # Frontend only (Vite dev server)
pnpm dev:back     # Backend only (tsx watch)
pnpm build        # Build both: vite build + tsc
```

## Backend-only Commands

```bash
cd backend
pnpm lint         # biome lint .
pnpm format       # biome format --write .
pnpm build        # tsc output to dist/
```

## Required Environment Setup

Both `backend/.env` and `frontend/.env` must exist. Key vars:
- **Backend**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT=3000`
- **Frontend**: `VITE_API_URL=http://localhost:3000`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Supabase Storage

Image uploads require a public bucket named `product-images` with RLS policies for authenticated INSERT/UPDATE.

## Code Style

- Biome config uses **tabs** for indentation and **double quotes** for JS
- Apply with `pnpm format` in backend (frontend uses ESLint/Prettier via Vite)

## Build Policy

Do NOT run `pnpm build` or `tsc --noEmit` automatically after every change. Only run builds when the user explicitly requests it, or when testing/verification is part of the task.