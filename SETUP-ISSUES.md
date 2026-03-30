# next-forge v6.0.1: Setup Issues Report

> Documenting every issue encountered from `npx next-forge@latest init` to a working local dev environment.
> Date: 2026-03-19 | Template version: 6.0.1 | Node: v25.8.1 | Bun: 1.3.11

---

## TL;DR

Running `bun run dev` after a fresh `next-forge init` **does not work**. We hit 7 distinct issues before getting 6/7 apps running. Many of these are confirmed upstream problems with 20+ GitHub issues spanning v2.x through v6.x. The core complaint — "optional integrations are not truly optional" — has never been fully resolved.

---

## Table of Contents

1. [Issues We Hit (Chronological)](#1-issues-we-hit-chronological)
2. [Fixes We Applied](#2-fixes-we-applied)
3. [Confirmed Upstream Issues (GitHub)](#3-confirmed-upstream-issues-github)
4. [Issues We Haven't Hit Yet (But Will)](#4-issues-we-havent-hit-yet-but-will)
5. [Gap Analysis: Docs vs Reality](#5-gap-analysis-docs-vs-reality)
6. [Current State](#6-current-state)

---

## 1. Issues We Hit (Chronological)

### Issue 1: Mintlify CLI Not Installed

**When:** First `bun run dev`
**Error:** `mintlify: command not found` (exit code 127)
**Impact:** Turbo aborts ALL apps — one failing package kills the entire dev experience.
**Root cause:** `apps/docs` requires Mintlify CLI installed globally, but it's not listed as a project dependency. The docs don't mention this as a hard prerequisite for `bun run dev`.

### Issue 2: Mintlify Incompatible with Node.js 25+

**When:** After installing Mintlify globally
**Error:** Schema compilation error — `SyntaxError: Unexpected token ':'`
**Impact:** Docs app crashes on startup.
**Root cause:** Two issues:
1. Mintlify CLI explicitly blocks Node >= 25 (`majorVersion >= 25` check in CLI source)
2. Dual-package `ajv` hazard — `ajv-errors` resolves to a different `ajv` instance than `@stoplight/spectral-core`, producing invalid JavaScript in generated validators.
**Upstream:** Confirmed in [#682](https://github.com/vercel/next-forge/issues/682). Also [#177](https://github.com/vercel/next-forge/issues/177), [#169](https://github.com/vercel/next-forge/issues/169).

### Issue 3: BaseHub CMS Token Kills Turbo Dev

**When:** Second `bun run dev` (after Mintlify fix)
**Error:** `Token not found. Make sure to include the BASEHUB_TOKEN env var.` (exit code 1)
**Impact:** `@repo/cms` package crashes, turbo aborts all apps again.
**Root cause:** `basehub dev` exits with code 1 if no token is present. Despite `BASEHUB_TOKEN` being marked `.optional()` in `keys.ts`, the BaseHub SDK itself crashes without it. This is an architecture issue — the `web` app imports BaseHub components at module level.
**Upstream:** Confirmed in [#621](https://github.com/vercel/next-forge/issues/621) (7 upvotes), [#360](https://github.com/vercel/next-forge/issues/360) (19 comments), [#376](https://github.com/vercel/next-forge/issues/376).

### Issue 4: Empty String Env Vars Fail Zod Validation

**When:** Running `turbo dev --filter=app` after bypassing CMS
**Error:** `Invalid string: must start with "sk_"` for CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
**Impact:** App fails to start.
**Root cause:** The CLI copies `.env.example` to `.env.local`, setting all vars to `""` (empty string). Zod's `.startsWith("sk_")` rejects `""` even though the field is `.optional()`. The `.optional()` modifier only handles `undefined`, not empty strings. This is a fundamental design flaw — the template's own generated env files break the template's own validation.
**Upstream:** Confirmed in [#537](https://github.com/vercel/next-forge/issues/537), [#647](https://github.com/vercel/next-forge/issues/647) (13 upvotes), [#251](https://github.com/vercel/next-forge/issues/251) (19 reactions — maintainer's own tracking issue, still incomplete).

### Issue 5: BETTERSTACK_URL Requires Valid URL

**When:** After removing empty-string env vars
**Error:** `Invalid URL` for `BETTERSTACK_URL`
**Impact:** App fails to start — `next.config.ts` won't load.
**Root cause:** `packages/observability/keys.ts` validates `BETTERSTACK_URL` with `z.url().optional()`. An empty string `""` from `.env.example` is not `undefined`, so `.optional()` doesn't apply, and `""` is not a valid URL.

### Issue 6: DATABASE_URL Is Required (Not Documented Prominently)

**When:** After fixing BETTERSTACK_URL
**Error:** `Invalid input: expected string, received undefined` for `DATABASE_URL`
**Impact:** App fails to start.
**Root cause:** `packages/database/keys.ts` uses `z.url()` with NO `.optional()` — this is the only truly required env var. But after removing empty strings from `.env.local` to fix Issue 4, `DATABASE_URL` became undefined. The chicken-and-egg: keep the empty string and Zod rejects it as an invalid URL; remove it and Zod rejects it as undefined.

### Issue 7: Prisma Studio Can't Find DATABASE_URL

**When:** After setting DATABASE_URL in app env files
**Error:** `No database URL found. Provide it via the --url <url> argument`
**Impact:** Studio app (port 3005) fails to start.
**Root cause:** Studio runs from `apps/studio/` but `prisma.config.ts` reads `process.env.DATABASE_URL`. The env var is set in `apps/app/.env.local` and `packages/database/.env`, but Studio's working directory doesn't load those files. Needed a separate `.env` in `apps/studio/`.

---

## 2. Fixes We Applied

| Issue | Fix Applied |
|-------|------------|
| Mintlify not installed | `bun add -g mintlify` |
| Mintlify + Node 25 | Symlinked `ajv` to resolve dual-package hazard. Updated `apps/docs/package.json` dev script to use Node 22 via nvm PATH override. Created `.nvmrc` with `22`. |
| BaseHub kills turbo | Used `turbo dev --filter=app --filter=web ...` to skip CMS. Alternatively use `--continue` flag. |
| Empty string env validation | Removed all empty-string env vars from `.env.local` files, keeping only required vars and valid values. |
| BETTERSTACK_URL | Set to `https://uptime.betterstack.com` (placeholder). |
| DATABASE_URL | Set to actual Prisma Postgres connection string. |
| Prisma Studio env | Created `apps/studio/.env` with DATABASE_URL. |
| Web app 404 at `/` | Navigate to `/en` directly — i18n rewrite doesn't fire without Clerk auth middleware configured. |

---

## 3. Confirmed Upstream Issues (GitHub)

### Open Issues

| # | Title | Impact |
|---|-------|--------|
| [#733](https://github.com/vercel/next-forge/issues/733) | CLI init: app scripts hardcode `bun --bun` regardless of selected package manager | Selecting pnpm/npm still generates bun-specific scripts |
| [#730](https://github.com/vercel/next-forge/issues/730) | Stripe not available in India/SEA/LATAM — no Razorpay adapter | Feature gap for non-Stripe regions |
| [#274](https://github.com/vercel/next-forge/issues/274) | Add configurable installation CLI (modular like create-t3-app) | Can't opt out of integrations at init time |
| [#362](https://github.com/vercel/next-forge/issues/362) | Custom authentication form (Clerk branding on auth pages) | UX concern |

### Closed Issues Confirming Our Experience

| # | Title | Upvotes | Actually Fixed? |
|---|-------|---------|-----------------|
| [#682](https://github.com/vercel/next-forge/issues/682) | Unable to get Next Forge setup and running | — | **No.** Bulk-closed. User had to use Claude Code to fix 5 issues. |
| [#647](https://github.com/vercel/next-forge/issues/647) | Optional packages still require env vars | 13 | **Partially.** Some vars fixed, pattern recurs. |
| [#621](https://github.com/vercel/next-forge/issues/621) | Can't skip BaseHub setup | 7 | **No.** Module-level imports still break without token. |
| [#537](https://github.com/vercel/next-forge/issues/537) | Optional env vars are not optional | — | **Partially.** `min(1)` removed from some vars, but `startsWith()` + empty string issue remains. |
| [#251](https://github.com/vercel/next-forge/issues/251) | Make environment variables optional | 19 | **Incomplete.** Maintainer's own tracking issue. Several vars still unchecked. |
| [#573](https://github.com/vercel/next-forge/issues/573) | Improve environment variable setup | — | Marked "released" but fundamental complexity remains. |
| [#177](https://github.com/vercel/next-forge/issues/177) | Missing mintlify dependency | — | Closed, but Mintlify still requires global install + Node version constraint undocumented. |
| [#360](https://github.com/vercel/next-forge/issues/360) | BaseHub exports not found | 19 comments | Documentation described as "incomplete and unclear." |

---

## 4. Issues We Haven't Hit Yet (But Will)

| # | Title | When You'll Hit It |
|---|-------|--------------------|
| [#646](https://github.com/vercel/next-forge/issues/646) | Prisma Query Engine not found on Vercel deploy | When deploying to Vercel — engine binary path needs special monorepo config |
| [#577](https://github.com/vercel/next-forge/issues/577) | WEB app type errors on Vercel deploy | During `turbo build` — type strictness issues only surface at build time |
| [#518](https://github.com/vercel/next-forge/issues/518) | Internationalization build failure (NextRequest type conflict) | If using i18n with pnpm — duplicate Next.js versions cause type mismatch |
| [#382](https://github.com/vercel/next-forge/issues/382) | `prisma db push` is dangerous for production | When running `bun run migrate` — uses `db push` which can drop data, no migration history |
| [#572](https://github.com/vercel/next-forge/issues/572) | shadcn monorepo CLI not working | When adding new shadcn/ui components to the design system |
| [#483](https://github.com/vercel/next-forge/issues/483) | CMS package causing large LCP | Performance issues from BaseHub components |

---

## 5. Gap Analysis: Docs vs Reality

| What Docs Say | What Actually Happens |
|---------------|----------------------|
| "All integrations besides the database are optional" | **Partially true.** `keys.ts` uses `.optional()` on most vars, but empty strings from `.env.example` still fail `.startsWith()` validators. BaseHub is architecturally non-optional — module-level imports crash without a valid token. |
| "Missing environment variables gracefully disable features" | **False for BaseHub/CMS, Mintlify docs, and Stripe CLI.** These crash the process rather than degrading gracefully. |
| "The CLI copies .env.example files to their working equivalents" | **True, but harmful.** 30+ empty-string vars get copied to `.env.local`. These empty strings fail Zod validation differently than `undefined`. Users must manually clean the files. |
| `bun run dev` starts development | **Fails out of the box.** Requires: (1) Mintlify CLI globally installed, (2) Node < 25, (3) BaseHub token OR manual turbo filtering, (4) Manual env file cleanup. |
| Package manager choice is respected | **Open bug [#733].** Scripts hardcode `bun --bun` regardless of selection. |
| "Node.js 20+" prerequisite | **Incomplete.** No documented upper bound. Mintlify fails on Node 25+. |
| Database setup: `bun run migrate` | **May break with Prisma 7.x** due to CLI flag changes. Studio app needs separate `.env` file. |
| Setup instructions are in one place | **Contradictory.** Issue [#682](https://github.com/vercel/next-forge/issues/682) notes that `/docs/setup/env` and `/docs/setup/prerequisites` conflict with each other. |

---

## 6. Current State

### Working (6/7 apps)

| App | Port | Status |
|-----|------|--------|
| app (main) | 3000 | Running — redirects to /sign-in (Clerk auth, expected) |
| web (marketing) | 3001 | Running — use /en path (i18n) |
| api | 3002 | Running — no root route (expected) |
| email (React Email) | 3003 | Running |
| docs (Mintlify) | 3004 | Running (with Node 22 workaround) |
| storybook | 6006 | Running |

### Not Working

| App | Port | Issue |
|-----|------|-------|
| studio (Prisma) | 3005 | Needs restart to pick up `.env` file |

### Not Configured (Require External Service Keys)

| Service | Env Vars Needed | Impact When Missing |
|---------|----------------|---------------------|
| Clerk (Auth) | `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | App redirects to broken sign-in page |
| Stripe (Payments) | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Payment features disabled, Stripe CLI errors in API app |
| Resend (Email) | `RESEND_TOKEN`, `RESEND_FROM` | Email sending disabled |
| BaseHub (CMS) | `BASEHUB_TOKEN` | CMS package crashes, web app may have import errors |
| Arcjet (Security) | `ARCJET_KEY` | Security middleware disabled (graceful) |
| Liveblocks (Collab) | `LIVEBLOCKS_SECRET` | Collaboration disabled (graceful) |
| PostHog (Analytics) | `NEXT_PUBLIC_POSTHOG_KEY` | Analytics disabled (graceful) |
| BetterStack (Observability) | `BETTERSTACK_API_KEY`, `BETTERSTACK_URL` | Logs to console instead (graceful) |
| Knock (Notifications) | `KNOCK_SECRET_API_KEY` | Notifications disabled (graceful) |
| Svix (Webhooks) | `SVIX_TOKEN` | Webhook delivery disabled (graceful) |

---

## 7. What the Official Docs Say vs What We Did

We read all four official setup docs (`quickstart.mdx`, `prerequisites.mdx`, `installation.mdx`, `env.mdx`). Here's the comparison:

### Quickstart doc claims "only two services are truly required: Clerk and PostgreSQL"

The `quickstart.mdx` says:
> "This guide gets you from zero to a running dev server with the minimum required setup. Only two services are truly required to boot: **Clerk** (authentication) and a **PostgreSQL database**."

**Reality:** We set up PostgreSQL and it still failed due to BaseHub, Mintlify, and empty-string env validation. Clerk is listed as "required to boot" in quickstart but "optional" in `env.mdx`. The two docs contradict each other.

### env.mdx claims "features will gracefully degrade"

The `env.mdx` says:
> "All integration environment variables are **optional** — next-forge will gracefully skip any integration that isn't configured. The only truly required variables are for core infrastructure (database and URLs)."

**Reality:** BaseHub does NOT gracefully degrade — it crashes the process. Mintlify does NOT gracefully degrade — it crashes turbo. The Stripe CLI in the API app exits with a fatal error. Three integrations crash instead of degrading.

### installation.mdx says CMS setup is required

The `installation.mdx` includes CMS setup as a required step before running `bun run dev`:
> "You will need to setup the CMS. Follow the instructions here..."

**This contradicts `env.mdx`** which says BaseHub is optional. In reality, the CMS IS effectively required because skipping it crashes `bun run dev`.

### prerequisites.mdx lists Mintlify CLI and Stripe CLI

The `prerequisites.mdx` mentions both CLIs but doesn't flag them as hard requirements. The init command's output does say:
> "Please make sure you install the Mintlify CLI and Stripe CLI before starting the project."

**We missed this.** The Mintlify CLI requirement was mentioned in the init output, though it's easy to miss in a wall of install logs. However, even if you install it, it still fails on Node 25+ (undocumented constraint).

### What we should have done differently

According to the docs, the "correct" flow was:
1. `npx next-forge@latest init`
2. Install Mintlify CLI and Stripe CLI globally (mentioned in init output + prerequisites)
3. Set up Clerk (sign up, get keys, add to env files)
4. Set up PostgreSQL (get DATABASE_URL, add to `packages/database/.env`)
5. Set up BaseHub CMS (fork template, get token)
6. Run `bun run migrate`
7. Run `bun run dev`

**What we actually did:**
1. `npx next-forge@latest init`
2. `bun run dev` (as any reasonable person would try first)
3. Spent 30+ minutes fixing cascading failures

### The fundamental problem

The docs are split across 4 pages with conflicting information:
- `quickstart.mdx`: "Only Clerk + Postgres required"
- `env.mdx`: "Only database + URLs required, everything else optional"
- `installation.mdx`: "You will need to setup the CMS" (required step)
- `prerequisites.mdx`: "Install Mintlify CLI and Stripe CLI" (soft requirement)

There is no single, authoritative "do exactly these steps" page. Issue [#682](https://github.com/vercel/next-forge/issues/682) explicitly called this out: *"The directions on these two pages conflict with one another."*

---

## Recommendations

1. **For next-forge maintainers:** `.env.example` should use comments (`# CLERK_SECRET_KEY=sk_...`) instead of empty strings (`CLERK_SECRET_KEY=""`). This is the root cause of 90% of first-run failures.

2. **For users:** After `next-forge init`, immediately delete all empty-string vars from `.env.local` files. Only set `DATABASE_URL` and the services you actually have keys for.

3. **For `bun run dev`:** Use filtered turbo commands until all services are configured:
   ```bash
   bunx turbo dev --filter=app --filter=web --filter=api --filter=email --filter=storybook --continue
   ```

4. **For Mintlify/docs:** Use Node 22 or skip the docs app entirely during development.
