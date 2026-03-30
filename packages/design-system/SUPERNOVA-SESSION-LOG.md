# Supernova Session Log

## Scope

This file records the Supernova work completed in this session from start to finish, including research, code changes, remote sync behavior, fixes, and current status.

## Initial goals

1. Index the Supernova developer documentation so implementation decisions could be based on current docs.
2. Move temporary `ansl-design` assets into the package-owned design-system area.
3. Build a script-based Supernova sync for foundations + themes.
4. Use the Supernova SDK directly rather than Figma.
5. Make the sync safe, validated, and eventually idempotent.

## Phase 1: Documentation indexing

- Attempted to discover pages under `https://developers.supernova.io/`.
- `firecrawl_map` failed, so sitemap discovery was done instead.
- Parsed the Supernova docs sitemap and found **104 URLs**.
- Fetched and indexed those pages into context mode.
- Indexed **832 searchable sections**.
- Verified indexing coverage with spot checks and `attempted=104 failures=0`.

## Phase 2: Repo discovery and planning

- Confirmed the relevant home for this work should be `packages/design-system`.
- Explored the monorepo structure and the package layout.
- Confirmed there was no existing Supernova integration in the repo.
- Read the original temporary source files in `ansl-design/`.
- Clarified desired shape with the user:
  - script-based sync
  - foundations + themes first
  - config via env vars
  - no internal management app yet

## Phase 3: Exact SDK research

- Queried exact Supernova SDK docs pages for:
  - SDK root object
  - workspaces
  - design systems
  - versions
  - brands
  - tokens
- Installed `@supernovaio/sdk@2.3.2` in `packages/design-system`.
- Inspected installed SDK typings and runtime object shapes.
- Confirmed the intended write pattern was object-by-object rather than uploading one giant JSON blob.

## Phase 4: Initial package-owned seed setup

The original temporary assets were moved into package ownership, then later replaced with copied v1.1 content.

Initial canonical paths created under the package:

- `packages/design-system/supernova/seed/foundations.v1.json`
- `packages/design-system/supernova/seed/blueprint.v1.md`
- `packages/design-system/supernova/seed/shadcn-theme.v1.css`

## Phase 5: Initial sync implementation

Created the first Supernova sync scaffold:

- `packages/design-system/scripts/supernova/lib/read-seed.ts`
- `packages/design-system/scripts/supernova/lib/supernova-client.ts`
- `packages/design-system/scripts/supernova/lib/sync-foundations.ts`
- `packages/design-system/scripts/supernova/sync-foundations.ts`

Updated `packages/design-system/package.json` with:

- `supernova:sync`
- `supernova:sync:dry-run`

Initial implementation supported:

- raw color primitives
- semantic colors
- space
- size
- radius
- border width
- border composite tokens
- shadow
- blur
- opacity
- duration
- z-index
- easing
- shadcn variable mapping
- light/dark theme modeling

## Light vs dark modeling

The sync intentionally models:

- **light** as the base/default token values
- **dark** as theme overrides

That means in the Supernova dashboard:

- `light` can appear empty or minimal if the UI emphasizes override rows
- `dark` appears more populated because it carries explicit overrides

This is expected with the current model and was verified directly in the code.

## Phase 6: Validation and early fixes

- Ran package typecheck repeatedly during development.
- Ran targeted lint/style checks on the new Supernova files.
- Fixed style issues, type issues, and a duplicate CSS variable in the seed CSS.

## Phase 7: Remote discovery and first dry-run

Used the SDK read-only to discover the target workspace/design system state.

Resolved:

- Workspace ID: `709359`
- Design system ID: `766910`
- Active version ID: `806104`
- Brand ID: `290e689a-5043-495d-8353-73ab04d550d7`
- Brand name: `Default`

First successful dry-run showed the sync would create the expected managed structure.

## Phase 8: First real sync and runtime bug

The first real sync failed with a runtime SDK write-shape error:

- `data.value can only be ShadowValue or ShadowTokenData[] with >= 1 elements.`

Root cause:

- the `shadow.none` token was serialized as an empty shadow array

Fix:

- changed `shadow.none` serialization to a valid no-op transparent zeroed shadow layer

After that fix:

- sync completed successfully

## Phase 9: Discovery of broken remote path model

During later auditing, the remote token tree was found to be malformed.

Examples observed remotely:

- `color.color.*`
- `implementation.implementation.*`
- `color.raw.raw`
- duplicated semantic/action/status branches
- duplicated scalar root group shapes

This proved the earlier sync logic was not modeling Supernova group/token paths correctly.

## Phase 10: Idempotency work

The user asked for the sync to be idempotent and for a prune-first workflow.

### New scripts added

- `packages/design-system/scripts/supernova/lib/prune-foundations.ts`
- `packages/design-system/scripts/supernova/prune-foundations.ts`

Updated `packages/design-system/package.json` with:

- `supernova:prune`
- `supernova:prune:dry-run`

### Idempotency improvements made

The sync logic was refactored to:

- reconcile by stable managed identity
- normalize remote group keys
- normalize remote token keys
- handle root-level scalar token families correctly
- build theme overrides only after base tokens exist with remote IDs
- handle legacy malformed remote path structures from earlier syncs

### Prune behavior

The prune script was designed to remove only the sync-managed footprint:

- managed themes
- managed token groups
- managed-key tokens outside managed groups

It was also hardened to tolerate already-missing remote elements during delete operations.

## Phase 11: v1.1 seed adoption and gradients

The user regenerated improved v1.1 seed files in `ansl-design/` because the previous package was missing gradients.

The new source files were:

- `ansl-design/ansl_supernova_foundations_v1_1.json`
- `ansl-design/ansl_supernova_blueprint_v1_1.md`
- `ansl-design/ansl_shadcn_theme_v1_1.css`

Important requirement from the user:

- **do not let the package seed folder disappear again**

Action taken:

- copied v1.1 contents into the canonical package seed files
- preserved the folder `packages/design-system/supernova/seed/`
- did **not** delete or move the source files in `ansl-design/`

Canonical package seed files now continue to be:

- `packages/design-system/supernova/seed/foundations.v1.json`
- `packages/design-system/supernova/seed/blueprint.v1.md`
- `packages/design-system/supernova/seed/shadcn-theme.v1.css`

### Gradient support added

The sync/read-seed/prune logic was extended for gradients.

Added support for:

- `foundations.gradient.raw`
- `foundations.gradient.semantic.light`
- `foundations.gradient.semantic.dark`
- `themes.light.semanticGradientValues`
- `themes.dark.semanticGradientValues`
- `themes.light.shadcnGradientVariables`
- `themes.dark.shadcnGradientVariables`

Gradient parsing support was added for the current seed gradient formats.

Dry-run after v1.1 adoption confirmed gradients were included.

## Phase 12: Clean prune, resync, and final idempotency verification

Sequence executed:

1. prune dry-run
2. real prune
3. real sync
4. repeat sync dry-run

The first attempts revealed a final remaining matching bug for root-level token families because Supernova returned token paths with root labels like:

- `Space`
- `Blur`
- `Duration`
- `Border Radius`
- `Border Width`
- `Z Index`

Final fix:

- normalized SDK/UI root-label token paths when deriving remote identity keys

### Final idempotency result

Latest dry-run after cleanup + resync:

- groups: `create: 0`, `update: 50`
- tokens: `create: 0`, `update: 274`
- themes: `create: 0`, `update: 2`

This means the sync is now **create-idempotent**:

- reruns do not create duplicate groups
- reruns do not create duplicate tokens
- reruns do not create duplicate themes

Important nuance:

- it is still **update-based**, not yet diff-no-op
- repeated dry-runs still show updates for managed items rather than skipping unchanged objects

## Files created or materially changed during the session

### Package seed files

- `packages/design-system/supernova/seed/foundations.v1.json`
- `packages/design-system/supernova/seed/blueprint.v1.md`
- `packages/design-system/supernova/seed/shadcn-theme.v1.css`

### Sync/prune code

- `packages/design-system/scripts/supernova/lib/read-seed.ts`
- `packages/design-system/scripts/supernova/lib/supernova-client.ts`
- `packages/design-system/scripts/supernova/lib/sync-foundations.ts`
- `packages/design-system/scripts/supernova/lib/prune-foundations.ts`
- `packages/design-system/scripts/supernova/sync-foundations.ts`
- `packages/design-system/scripts/supernova/prune-foundations.ts`

### Package config

- `packages/design-system/package.json`
- `bun.lock`

## Important conclusions

### Background color clarification

After rereading the actual package seed files, the current light-mode background in the seed is:

- `#FCFAF8`

Not `#EADFD0`.

Current seed usage is:

- background/canvas: `#FCFAF8`
- page/card/popover: `#F9F5F1`
- border/input default: `#EADFD0`

### Gradients

The original v1 seed really was missing gradients.

The adopted v1.1 package now includes them.

### Light theme visibility in dashboard

If the Supernova dashboard appears to show more for dark than light, that is expected under the current model because:

- light = base token values
- dark = explicit theme overrides

### Brand name

The discovered Supernova brand name was:

- `Default`

This came from the actual Supernova brand record, not an internal SDK placeholder.

## Commands / scripts now available in `packages/design-system`

- `bun run --cwd packages/design-system supernova:sync`
- `bun run --cwd packages/design-system supernova:sync:dry-run`
- `bun run --cwd packages/design-system supernova:prune`
- `bun run --cwd packages/design-system supernova:prune:dry-run`
- `bun run --cwd packages/design-system typecheck`

## Current state at end of session

- Supernova docs were indexed for implementation reference.
- The package owns canonical seed files under `packages/design-system/supernova/seed/`.
- v1.1 seed files from `ansl-design/` were copied into those canonical files.
- Gradient support is implemented in the sync model.
- The remote malformed managed token tree was pruned and rebuilt.
- The current sync is create-idempotent.
- The seed folder remains in place.

## Remaining known follow-up

1. If desired, make sync **diff-no-op** instead of always update-based.
2. If desired, add SDK-driven documentation bootstrapping for Supernova docs IA.
3. Rotate the Supernova API key that was pasted into chat, since it should be treated as exposed.
