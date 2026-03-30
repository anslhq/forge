#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/harsha/Developer/anslhq/forge"

cd "$ROOT"

echo "==> forge mission init"

if ! command -v bun >/dev/null 2>&1; then
  echo "error: bun is required but was not found in PATH" >&2
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "error: package.json not found in $ROOT" >&2
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "==> installing dependencies"
  bun install
else
  echo "==> dependencies already present; skipping bun install"
fi

mkdir -p .factory/library

echo "==> init complete"
echo "Validation baseline:"
echo "  - bun run check"
echo "  - bun x tsc --noEmit -p apps/app/tsconfig.json"
echo "  - bun x tsc --noEmit -p apps/web/tsconfig.json"
echo "  - bun x tsc --noEmit -p apps/storybook/tsconfig.json"
echo "  - bun x tsc --noEmit -p packages/design-system/tsconfig.json"
echo "  - bun x tsc --noEmit -p packages/backend/tsconfig.json"
echo "  - bun run test"
echo "Local surfaces:"
echo "  - app: http://localhost:3000"
echo "  - web: http://localhost:3001"
echo "  - docs: http://localhost:3004"
echo "  - storybook: http://localhost:6006"
echo "Convex setup:"
echo "  - cd packages/backend && bun run dev:setup"
