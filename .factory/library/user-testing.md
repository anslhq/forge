# User Testing Knowledge

## Default validation gate

- `bun run check`
- `bun x tsc --noEmit -p apps/app/tsconfig.json`
- `bun x tsc --noEmit -p apps/web/tsconfig.json`
- `bun x tsc --noEmit -p apps/storybook/tsconfig.json`
- `bun x tsc --noEmit -p packages/design-system/tsconfig.json`
- `bun x tsc --noEmit -p packages/backend/tsconfig.json`
- `bun run test`

## Browser surfaces

- app: `http://localhost:3000`
- web: `http://localhost:3001`
- docs: `http://localhost:3004`
- storybook: `http://localhost:6006`

## Convex prerequisite

- Run `cd packages/backend && bun run dev:setup` when a fresh machine or deployment needs Convex setup.
- Ensure `NEXT_PUBLIC_CONVEX_URL` is available in `packages/backend/.env.local`, `apps/app/.env.local`, and `apps/web/.env.local` before runtime validation.

## Validation guidance

- Prefer read-only inspection plus the standard validation gate.
- Do not modify source files during a pure validation pass.
- Treat command output as the source of truth for pass/fail decisions.
- If a command fails due to missing local env or external setup, report the exact blocker instead of masking it.
