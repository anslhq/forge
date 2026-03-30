# shadcn Monorepo CLI

Known issues and workarounds for using the shadcn CLI in this monorepo.

**What belongs here:** CLI usage patterns, known bugs, workarounds.

---

## Known CLI bug: wrong file path in monorepo

The shadcn CLI (v4.0.8) has a confirmed bug ([shadcn-ui/ui#9239](https://github.com/shadcn-ui/ui/issues/9239)) where it treats `components.json` aliases as literal filesystem paths instead of resolving them through workspace package resolution.

**Symptom:** running `bunx shadcn@latest add <component> -c packages/design-system` can create files using the alias path literally instead of writing into `packages/design-system/components/...`.

**Also broken:** generated imports may self-reference the alias path instead of a relative/internal path.

## Workaround: post-CLI fixup

After running `shadcn add`:

1. Move files from any wrongly-created alias directory back into `packages/design-system/components/`
2. Fix imports:
   - Replace `from "@platform/design-system/components/..."` self-references with the correct relative/internal path when needed
   - Replace wrong utils aliases with `@platform/design-system/lib/utils` or the correct relative path based on the file location
3. Remove any wrongly-created alias directory
4. Run `bun x ultracite fix` to reformat

## Running the CLI

Use the design-system config directly:

```bash
bunx shadcn@latest add <component> --overwrite -c packages/design-system
```

`packages/design-system/components.json` is the canonical shadcn config in this repo. Do not assume `@workspace/ui` or `packages/ui` exists.
