# Portless

Portless is **not** the canonical local runtime surface for Forge right now.

**What belongs here:** whether Portless is configured, fallback local URL strategy, and future notes if Portless is introduced later.

---

## Current status

- Forge currently uses direct localhost ports, not Portless-managed hostnames.
- No committed Portless startup scripts are present in this repo.
- Do not assume `*.localhost:1355` or custom domains exist for Forge.

## Current local surfaces

- app: `http://localhost:3000`
- web: `http://localhost:3001`
- docs: `http://localhost:3004`
- storybook: `http://localhost:6006`

## If Portless is added later

- Add explicit startup scripts to the repo before documenting Portless as canonical.
- Update `.factory/services.yaml` and this file together.
- Prefer `bunx`/`bun`-based commands and repo-local scripts over ad hoc global shell snippets.
