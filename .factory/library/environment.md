# Environment

Environment variables, external dependencies, and setup notes for the Forge workspace.

**What belongs here:** required env vars, external services, local setup prerequisites, machine-specific notes.
**What does NOT belong here:** service ports/commands (use `.factory/services.yaml`).

---

## Convex

- `packages/backend/.env.local` is the backend package's local source of truth for Convex deployment settings.
- `apps/app/.env.local` and `apps/web/.env.local` must contain `NEXT_PUBLIC_CONVEX_URL` so app/web clients can talk to Convex.
- Do not commit new real secrets. Keep production/private values user-local or provider-managed.

## Removed SQL/Prisma assumptions

- `packages/database`, Prisma, and `apps/studio` are no longer part of this repo's runtime architecture.
- Do not add `DATABASE_URL` back into app/web env files unless a separate SQL integration is explicitly introduced.

## Current local URLs

- app: `http://localhost:3000`
- web: `http://localhost:3001`
- docs: `http://localhost:3004`
- storybook: `http://localhost:6006`

## Local setup prerequisites

- `bun` is required.
- Convex CLI access is required to run `cd packages/backend && bun run dev:setup` or `bun run dev`.
- Clerk/Stripe/other optional services can remain unset for partial local work as long as the task does not require them.
