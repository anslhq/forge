# Architecture

Architectural decisions and ownership rules for the current Forge workspace.

**What belongs here:** workspace boundaries, package ownership, composition rules, integration constraints.

---

## Approved workspace shape

- `apps/app` is the authenticated product app.
- `apps/web` is the marketing/content site.
- `apps/storybook` is the isolated component workbench.
- `packages/design-system` owns the shared design-system surface.
- `packages/backend` owns Convex schema, functions, and client/provider glue.

## Shared UI ownership

- `packages/design-system` owns shared tokens, global styles, utilities, hooks, primitives, and portable presentational components.
- Prefer public package exports over deep imports.
- Shared package code must not depend on `next/*`, app route files, or app-local env/runtime glue.

## Backend ownership

- `packages/backend` owns Convex setup: `convex/`, generated API/types, env access, and `ConvexClientProvider`.
- Root scripts delegate Convex work to `@platform/backend`; do not reintroduce a root-level `convex/` directory.
- `apps/app` and other consumers should import Convex references from `@platform/backend/convex/_generated/api`.

## App ownership

- `apps/app` owns route files, authenticated application composition, webhook route handlers, and app-specific Convex reads/writes.
- `apps/web` owns marketing content, SEO/MDX composition, and public-site runtime concerns.
- `apps/storybook` must consume `@platform/design-system` through package exports only.

## Convex function reference pitfall

The Convex `api` object is a JavaScript `Proxy`. Accessing `api.x.y` inside a React render creates a new `FunctionReference` each render and can trigger re-render loops.

**Fix:** hoist references to module scope.

```ts
const pagesList = api.pages.list;

function MyComponent() {
  const data = useQuery(pagesList);
}
```

## Storybook ownership

- Preview must load shared styles from `@platform/design-system/styles/globals.css`.
- Stories should import public exports only; do not import app internals.
- Theme switching, docs/autodocs, accessibility, and interaction coverage belong in Storybook, not the app packages.
