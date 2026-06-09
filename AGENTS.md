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
- **Backend**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT=3000`, `SLACK_TOKEN_SHEET_URL`
- **Frontend**: `VITE_API_URL=http://localhost:3000`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Supabase Storage

Image uploads require a public bucket named `product-images` with RLS policies for authenticated INSERT/UPDATE.

## Code Style

- Biome config uses **tabs** for indentation and **double quotes** for JS
- Apply with `pnpm format` in backend (frontend uses ESLint/Prettier via Vite)

## Build Policy

Do NOT run `pnpm build` or `tsc --noEmit` automatically after every change. Only run builds when the user explicitly requests it, or when testing/verification is part of the task.

## .env Files

Never read, write, or request access to `.env` files. The developer handles all `.env` changes manually. If a new environment variable is needed, document it in this file and notify the developer with the exact key and expected value so they can add it themselves.

## Filesystem Access

Never request access to directories outside the project scope (the repository root). All operations must be contained within the project directory. If a tool requires external directory access, deny the request and find an alternative approach.

## Project Agents (`.opencode/agents/`)

Subagents defined in `.opencode/agents/` can be invoked via `@name`:

| Agent | Description | Tools |
|-------|-------------|-------|
| `@docs-writer` | Writes and maintains project documentation for features, APIs, and components | write, edit |
| `@security-auditor` | Audits codebase for vulnerabilities and ensures cybersecurity best practices | read-only |
| `@implementer` | Writes production-ready code following project conventions | write, edit, bash |
| `@code-reviewer` | Reviews code for quality, best practices, security, and performance | read-only (bash for git/grep) |
| `@git-committer` | Stages specified files and creates conventional commits | bash (git) |

## Standard Operating Procedure for Code Changes

Cada vez que se realicen cambios en el código, se debe seguir este orden estrictamente:

1. **@code-reviewer** — Revisa primero el código existente sobre el que se va a trabajar para verificar que esté en óptimas condiciones. Si se encuentran problemas, deben corregirse antes de continuar.

2. **@implementer** — Una vez que el código existente está en buen estado, procede a implementar los cambios solicitados.

3. **@code-reviewer** — Revisa el código implementado para asegurarse de que cumpla con los estándares actuales del proyecto.

4. **@security-auditor** — Revisa el código implementado para asegurarse de que no introduzca ninguna falla de seguridad nueva.

5. **@docs-writer** — Documenta los cambios implementados y los presenta al desarrollador.

### Para Commits y PRs

Cuando se le solicite a **@git-committer** realizar un commit o una pull request, este agente únicamente deberá recopilar la información generada durante el proceso anterior (cambios realizados, revisiones, auditorías y documentación) para construir el mensaje de commit o la descripción de la PR. No debe realizar ninguna revisión ni documentación adicional por su cuenta.