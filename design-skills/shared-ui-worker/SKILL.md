---
name: shared-ui-worker
description: Build and migrate the shared UI package, package wiring, and web-app ownership boundaries for the monorepo.
---

# Shared UI Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use this skill for features that:
- create or evolve `packages/design-system`
- move shared tokens, utilities, hooks, or primitives into the shared package
- repair the local validation path needed for later app/web/storybook verification
- migrate `apps/app`, `apps/web`, or `apps/storybook` to consume shared UI while keeping runtime-bound code local

## Work Procedure

1. Read `mission.md`, mission `AGENTS.md`, `.factory/services.yaml`, `.factory/library/architecture.md`, `.factory/library/environment.md`, and `.factory/library/portless.md` before changing anything.
2. Inspect the current ownership boundary in `packages/design-system`, `apps/app`, `apps/web`, and `apps/storybook`, including each workspace's imports, styles entrypoints, and `components.json`/tsconfig wiring where relevant.
3. Invoke relevant built-in skills before implementation when applicable:
   - `shadcn` for shared package/alias decisions
   - `next-best-practices` for Next.js boundary decisions
   - `vercel-react-best-practices` after changing multiple React files
   - `portless` if startup scripts or local URLs are touched
4. If the feature changes behavior that can be covered by automated tests or Storybook interaction tests, add the failing test/story interaction first, then implement the code to make it pass.
5. Keep `packages/design-system` free of app-specific routing, request/runtime server glue, and workspace-only env wiring. Shared primitives may depend on approved reusable UI/runtime packages already used in the repo, but app ownership must stay in the consuming workspace. If progress would require violating that rule, stop and return to orchestrator.
6. Prefer public package exports; do not leave consumers importing from `src/*` internals across workspaces.
7. After edits, run the mission validation baseline relevant to your change:
   - `bun run check`
   - explicit web typecheck from `.factory/services.yaml`
   - package/app build commands relevant to the feature
   - if a baseline command fails only because of a trivial pre-existing formatting issue in the current feature scope or mission artifacts, you may fix that mechanical issue and rerun once before escalating; otherwise return to orchestrator
8. Manually verify the real surface when applicable:
   - use the committed localhost surfaces from `.factory/library/environment.md`
   - verify preserved shared-component behavior in the affected workspace(s)
9. Update shared state only when your feature changes operational truth (for example `.factory/services.yaml` or `.factory/library/*`).
10. In the handoff, be explicit about what moved into `packages/design-system`, what intentionally remained in the consuming workspace(s), and exactly which commands and manual checks proved the result.

## Example Handoff

```json
{
  "salientSummary": "Updated `packages/design-system` as the canonical shared UI package, moved the shared helper/component surface out of app-local ownership, and rewired consumers to target the package's public exports. Runtime-only app behavior remained in the consuming workspace and no app-only glue leaked into the design system package.",
  "whatWasImplemented": "Migrated shared primitives/styles/helpers into `@platform/design-system`, updated workspace imports and alias wiring, and preserved app-local ownership for providers, routing, data fetching, and other runtime-only code.",
  "whatWasLeftUndone": "Did not add Storybook stories in this feature; that remains for the Storybook milestone.",
  "verification": {
    "commandsRun": [
      {
        "command": "bun run check",
        "exitCode": 0,
        "observation": "Repo lint/format checks passed after the shared-package migration."
      },
      {
        "command": "bun x tsc --noEmit -p /Users/harsha/Developer/anslhq/forge/apps/web/tsconfig.json",
        "exitCode": 0,
        "observation": "The affected workspace typecheck passed with imports redirected to `@platform/design-system`."
      },
      {
        "command": "bun run --cwd /Users/harsha/Developer/anslhq/forge/apps/web build",
        "exitCode": 0,
        "observation": "Next.js build succeeded using the shared UI package."
      }
    ],
    "interactiveChecks": [
      {
        "action": "Opened the affected local surface, exercised the updated shared UI, and checked for regressions in the visible workflow.",
        "observed": "The shared component changes rendered correctly on the configured localhost surface and no runtime regressions were observed during the manual check."
      }
    ]
  },
  "tests": {
    "added": [
      {
        "file": "/Users/harsha/Developer/anslhq/forge/apps/storybook/stories/button.stories.tsx",
        "cases": [
          {
            "name": "primary button story consumes the exported shared primitive",
            "verifies": "Storybook and app consumers resolve the same package export instead of a local primitive copy."
          }
        ]
      }
    ]
  },
  "discoveredIssues": [
    {
      "severity": "medium",
      "description": "Local web validation still depends on a user-local Convex URL; if that env is unavailable in later sessions, web migration verification will block until restored.",
      "suggestedFix": "Track the prerequisite in `.factory/library/environment.md` and return to orchestrator if the env disappears again."
    }
  ]
}
```

## When to Return to Orchestrator

- A required change would move app-only routing, data, or env ownership into `packages/design-system`.
- Shared package exports or TS/path aliasing need a repo-wide architectural decision beyond the approved mission scope.
- The web validation blocker requires unavailable user credentials or external setup.
- A feature reveals additional reusable app components that should move into shared UI, but the migration scope would materially exceed the approved milestone.
