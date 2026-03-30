import type {
  Brand,
  RemoteVersionIdentifier,
  Supernova,
  Token,
  TokenGroup,
  TokenTheme,
} from "@supernovaio/sdk";
import { TokenType } from "@supernovaio/sdk";

import type { SupernovaFoundationsSeed } from "./read-seed";
import {
  collectSeedSpecs,
  getRemoteGroupKey,
  getRemoteTokenKey,
} from "./sync-foundations";

interface PruneOptions {
  dryRun?: boolean;
}

const tokenTypeRootSegments = new Map<TokenType, string>([
  [TokenType.blur, "blur"],
  [TokenType.border, "border"],
  [TokenType.borderWidth, "borderWidth"],
  [TokenType.color, "color"],
  [TokenType.duration, "duration"],
  [TokenType.gradient, "gradient"],
  [TokenType.opacity, "opacity"],
  [TokenType.radius, "radius"],
  [TokenType.shadow, "shadow"],
  [TokenType.size, "size"],
  [TokenType.space, "space"],
  [TokenType.zIndex, "zIndex"],
]);

const collapseAdjacentDuplicates = (segments: string[]): string[] =>
  segments.reduce<string[]>((collapsed, segment) => {
    if (collapsed.at(-1) !== segment) {
      collapsed.push(segment);
    }

    return collapsed;
  }, []);

const isLegacyRootDuplicateGroup = (
  group: TokenGroup,
  managedTokenTypes: Set<TokenType>
): boolean => {
  if (group.isRoot || !managedTokenTypes.has(group.tokenType)) {
    return false;
  }

  const redundantRootSegment = tokenTypeRootSegments.get(group.tokenType);

  if (!redundantRootSegment) {
    return false;
  }

  const rawLogicalPath = collapseAdjacentDuplicates([
    ...group.path,
    group.name,
  ]);

  return (
    rawLogicalPath.length === 1 && rawLogicalPath[0] === redundantRootSegment
  );
};

const previewItems = (items: string[]): string => {
  if (items.length === 0) {
    return "  - none";
  }

  const preview = items.slice(0, 8).map((item) => `  - ${item}`);
  const remainingCount = items.length - preview.length;

  if (remainingCount > 0) {
    preview.push(`  - ...and ${remainingCount} more`);
  }

  return preview.join("\n");
};

const summarizePrunePlan = (
  brand: Brand,
  themes: TokenTheme[],
  tokens: Token[],
  groups: TokenGroup[]
): void => {
  console.log(`Supernova prune plan for brand ${brand.name} (${brand.id})`);
  console.log(`- themes: ${themes.length}`);
  console.log(previewItems(themes.map((theme) => theme.codeName)));
  console.log(`- tokens outside managed groups: ${tokens.length}`);
  console.log(
    previewItems(
      tokens.map(
        (token) =>
          token.tokenPath?.join(".") ?? `${token.parentGroupId}.${token.name}`
      )
    )
  );
  console.log(`- managed groups: ${groups.length}`);
  console.log(previewItems(groups.map((group) => group.path.join(" / "))));
};

const sortGroupsForDeletion = (groups: TokenGroup[]): TokenGroup[] =>
  [...groups].sort((left, right) => {
    if (left.path.length !== right.path.length) {
      return right.path.length - left.path.length;
    }

    return left.path.join("/").localeCompare(right.path.join("/"));
  });

const isMissingRemoteElementError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);

  return message.includes("was not found in design system version");
};

const swallowMissingRemoteElementError = async (
  operation: () => Promise<void>
): Promise<void> => {
  try {
    await operation();
  } catch (error) {
    if (!isMissingRemoteElementError(error)) {
      throw error;
    }
  }
};

export const pruneFoundations = async (
  sdk: Supernova,
  seed: SupernovaFoundationsSeed,
  remoteVersion: RemoteVersionIdentifier,
  brand: Brand,
  options: PruneOptions = {}
): Promise<void> => {
  const seedSpecs = collectSeedSpecs(seed);
  const [remoteGroups, remoteThemes, remoteTokens] = await Promise.all([
    sdk.tokens.getTokenGroups(remoteVersion, { brandId: brand.id }),
    sdk.tokens.getTokenThemes(remoteVersion, { brandId: brand.id }),
    sdk.tokens.getTokens(remoteVersion, { brandId: brand.id }),
  ]);
  const groupsById = new Map(remoteGroups.map((group) => [group.id, group]));
  const managedGroupKeys = new Set(
    seedSpecs.groupSpecs.map((spec) => spec.key)
  );
  const managedTokenKeys = new Set(
    seedSpecs.tokenSpecs.map((spec) => spec.key)
  );
  const managedTokenTypes = new Set(
    seedSpecs.tokenSpecs.map((spec) => spec.tokenType)
  );
  const managedThemeCodeNames = new Set(
    seedSpecs.themeSpecs.map((spec) => spec.codeName)
  );
  const managedGroups = sortGroupsForDeletion(
    remoteGroups.filter((group) => {
      const groupKey = getRemoteGroupKey(group);

      if (groupKey && managedGroupKeys.has(groupKey)) {
        return true;
      }

      return isLegacyRootDuplicateGroup(group, managedTokenTypes);
    })
  );
  const managedGroupIds = new Set(managedGroups.map((group) => group.id));
  const managedThemes = remoteThemes.filter((theme) =>
    managedThemeCodeNames.has(theme.codeName)
  );
  const tokensOutsideManagedGroups = remoteTokens.filter((token) => {
    const tokenKey = getRemoteTokenKey(token, groupsById);

    if (!(tokenKey && managedTokenKeys.has(tokenKey))) {
      return false;
    }

    return !managedGroupIds.has(token.parentGroupId);
  });

  summarizePrunePlan(
    brand,
    managedThemes,
    tokensOutsideManagedGroups,
    managedGroups
  );

  if (options.dryRun) {
    console.log("Dry run complete. No changes were written to Supernova.");
    return;
  }

  for (const theme of managedThemes) {
    await swallowMissingRemoteElementError(() =>
      sdk.tokens.deleteTokenTheme(remoteVersion, theme.idInVersion)
    );
  }

  for (const token of tokensOutsideManagedGroups) {
    await swallowMissingRemoteElementError(() =>
      sdk.tokens.deleteToken(remoteVersion, token.idInVersion)
    );
  }

  for (const group of managedGroups) {
    await swallowMissingRemoteElementError(() =>
      sdk.tokens.deleteTokenGroup(
        remoteVersion,
        group,
        remoteTokens,
        remoteGroups
      )
    );
  }

  console.log("Supernova prune completed.");
};
