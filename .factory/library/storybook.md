# Storybook Knowledge

## Current Forge Storybook setup

- Workspace app: `apps/storybook`
- Framework: `@storybook/nextjs`
- Shared styles source: `@platform/design-system/styles/globals.css`
- Shared providers used in preview: `ThemeProvider`, `TooltipProvider`, `Toaster`

## Component import rule

- Stories must consume `@platform/design-system` public exports only.
- Do not import app-local UI code into Storybook stories.

## Theme behavior

- Storybook uses class-based light/dark theme switching.
- Chromatic modes are configured for both light and dark variants.

## Validation surface

- Local dev URL: `http://localhost:6006`
- Typecheck entry: `bun x tsc --noEmit -p apps/storybook/tsconfig.json`
- Build entry: `bun run --cwd apps/storybook build`
