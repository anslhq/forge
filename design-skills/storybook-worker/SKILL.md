---
name: storybook-worker
description: Build the Storybook workspace app, stories, theming, docs, and validation surface for the shared UI package.
---

# Storybook Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use this skill for features that:
- create or configure `apps/storybook`
- add Storybook stories, docs/autodocs, a11y, and minimal interaction/testing surfaces
- wire Storybook into the current monorepo validation commands and local workflow surface
- prove Storybook consumes `packages/design-system` through package exports

## Work Procedure

1. Read `mission.md`, mission `AGENTS.md`, `.factory/services.yaml`, `.factory/library/architecture.md`, `.factory/library/portless.md`, and `.factory/library/user-testing.md` before editing.
2. Inspect the shared package export surface and the current root workspace/turbo configuration before choosing Storybook scripts or config locations.
3. Invoke relevant built-in skills before implementation when applicable:
   - `portless` for named local surfaces
   - `next-best-practices` for framework/config interactions
   - `vercel-react-best-practices` after editing multiple React/story files
4. Configure Storybook as a workspace app that consumes `packages/design-system` through public exports only. Do not import app internals or package `src/*` deep paths.
5. Load shared global styles in Storybook preview from the shared package, not copied app-local CSS.
6. Enable and exercise the mission-required surfaces:
   - docs/autodocs
   - theme switching
   - accessibility review
   - a minimal interaction/testing path for at least one shared story
   - if using Storybook 9, install and configure `@storybook/addon-docs` explicitly; do not assume docs pages render without that addon
7. When changing startup/validation surfaces, keep committed command/service artifacts aligned with the repo's current localhost workflow and update them if the operational truth changes.
8. Run the relevant validation commands after edits, including repo checks and any Storybook-specific build/test commands introduced by the feature.
9. Manually verify Storybook via its configured local URL and capture observations for theme changes, docs pages, and the interaction/testing surface.
10. In the handoff, name the exact shared stories validated and the exact local URL used.

## Example Handoff

```json
{
  "salientSummary": "Created `apps/storybook`, wired it into the workspace, and added shared button/card stories that load `packages/design-system` styles through preview. Verified the Storybook local surface, docs page, dark-mode toggle, and one interaction-enabled story.",
  "whatWasImplemented": "Added the dedicated Storybook workspace app and config, connected it to `@platform/design-system` exports, enabled docs/a11y/theme addons, loaded the shared style entry in preview, and created a minimal interaction/testing story so shared UI can be validated in isolation.",
  "whatWasLeftUndone": "Did not migrate remaining app-local web primitives; that belongs to the web migration milestone.",
  "verification": {
    "commandsRun": [
      {
        "command": "bun run check",
        "exitCode": 0,
        "observation": "Repo checks passed after adding Storybook config and stories."
      },
      {
        "command": "bun run --cwd /Users/harsha/Developer/anslhq/forge/apps/storybook build",
        "exitCode": 0,
        "observation": "Storybook build completed successfully from the workspace app."
      }
    ],
    "interactiveChecks": [
      {
        "action": "Opened the repo's configured local Storybook URL, viewed the shared Button docs page, toggled dark mode, and ran the minimal interaction story.",
        "observed": "Storybook loaded at the configured localhost surface, docs rendered for the shared component, dark mode updated the root theme attribute and component appearance, and the interaction story completed without console errors."
      }
    ]
  },
  "tests": {
    "added": [
      {
        "file": "/Users/harsha/Developer/anslhq/forge/apps/storybook/stories/button.stories.tsx",
        "cases": [
          {
            "name": "button docs story resolves shared package export",
            "verifies": "Storybook consumes `@platform/design-system` exports rather than app-local primitives."
          },
          {
            "name": "button interaction story exercises the configured interaction surface",
            "verifies": "At least one shared story supports the mission's minimal interaction/testing path."
          }
        ]
      }
    ]
  },
  "discoveredIssues": [
    {
      "severity": "low",
      "description": "If Storybook startup scripts drift away from `.factory/services.yaml`, local validation could become flaky for later validators.",
      "suggestedFix": "Keep the committed service manifest aligned whenever Storybook dev/build commands change."
    }
  ]
}
```

## When to Return to Orchestrator

- Storybook cannot consume the shared package without deep imports or app-internal coupling.
- Storybook startup cannot be encoded in committed repo command/service surfaces.
- Required docs/a11y/interaction coverage would force scope beyond the approved Storybook milestone.
- Storybook framework/build choices require an architectural tradeoff not covered by the approved mission.
