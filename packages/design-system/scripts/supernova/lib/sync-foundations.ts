import {
  type AnyToken,
  BlurType,
  BorderPosition,
  BorderStyle,
  type Brand,
  GradientType,
  type RemoteVersionIdentifier,
  ShadowType,
  type Supernova,
  type Token,
  type TokenGroup,
  type TokenTheme,
  TokenType,
  Unit,
} from "@supernovaio/sdk";

import type {
  SeedBorderToken,
  SeedTokenMap,
  SupernovaFoundationsSeed,
} from "./read-seed";

export interface GroupSpec {
  key: string;
  path: string[];
  tokenType: TokenType;
}

type MutableBlurToken = AnyToken & {
  value: {
    radius: {
      measure: number;
      referencedTokenId: string | null;
      unit: Unit;
    };
    referencedTokenId: string | null;
    type: BlurType;
  };
};

type MutableBorderToken = AnyToken & {
  value: {
    color: {
      color: {
        b: number;
        g: number;
        r: number;
        referencedTokenId: string | null;
      };
      opacity: {
        measure: number;
        referencedTokenId: string | null;
        unit: Unit;
      };
      referencedTokenId: string | null;
    };
    position: BorderPosition;
    referencedTokenId: string | null;
    style: BorderStyle;
    width: {
      measure: number;
      referencedTokenId: string | null;
      unit: Unit;
    };
  };
};

type MutableColorToken = AnyToken & {
  value: {
    color: {
      b: number;
      g: number;
      r: number;
      referencedTokenId: string | null;
    };
    opacity: {
      measure: number;
      referencedTokenId: string | null;
      unit: Unit;
    };
    referencedTokenId: string | null;
  };
};

type MutableDimensionToken = AnyToken & {
  value: {
    measure: number;
    referencedTokenId: string | null;
    unit: Unit;
  };
};

interface MutableGradientStop {
  color: {
    color: {
      b: number;
      g: number;
      r: number;
      referencedTokenId: string | null;
    };
    opacity: {
      measure: number;
      referencedTokenId: string | null;
      unit: Unit;
    };
    referencedTokenId: string | null;
  };
  position: number;
}

interface MutableGradientToken {
  value: Array<{
    aspectRatio: number;
    from: {
      x: number;
      y: number;
    };
    referencedTokenId: string | null;
    stops: MutableGradientStop[];
    to: {
      x: number;
      y: number;
    };
    type: GradientType;
  }>;
}

interface MutableShadowValue {
  color: {
    color: {
      b: number;
      g: number;
      r: number;
      referencedTokenId: string | null;
    };
    opacity: {
      measure: number;
      referencedTokenId: string | null;
      unit: Unit;
    };
    referencedTokenId: string | null;
  };
  radius: number;
  referencedTokenId: string | null;
  spread: number;
  type: ShadowType;
  x: number;
  y: number;
}

const createNoneShadowValue = (): MutableShadowValue => ({
  color: {
    color: {
      b: 0,
      g: 0,
      r: 0,
      referencedTokenId: null,
    },
    opacity: {
      measure: 0,
      referencedTokenId: null,
      unit: Unit.raw,
    },
    referencedTokenId: null,
  },
  radius: 0,
  referencedTokenId: null,
  spread: 0,
  type: ShadowType.drop,
  x: 0,
  y: 0,
});

type MutableStringToken = AnyToken & {
  value: {
    referencedTokenId: string | null;
    text: string;
  };
};

interface PreparedGroup {
  action: SyncAction;
  group: TokenGroup;
  parentGroupKey: string | null;
  siblingOrder: number;
  spec: GroupSpec;
}

interface PreparedGroupsResult {
  groups: PreparedGroup[];
  index: Map<string, PreparedGroup>;
}

interface PreparedSync {
  brand: Brand;
  groupIndex: Map<string, PreparedGroup>;
  groups: PreparedGroup[];
  referenceIndex: Map<string, string>;
  remoteVersion: RemoteVersionIdentifier;
  rootGroups: Map<TokenType, TokenGroup>;
  themes: PreparedTheme[];
  tokenIndex: TokenIndex;
  tokens: PreparedToken[];
}

interface PreparedTheme {
  action: SyncAction;
  spec: ThemeSpec;
  theme: TokenTheme;
}

interface PreparedToken {
  action: SyncAction;
  groupKey: string | null;
  siblingOrder: number;
  spec: TokenSpec;
  token: AnyToken;
}

interface SyncOptions {
  dryRun?: boolean;
}

interface SyncRemoteState {
  groupsById: Map<string, TokenGroup>;
  remoteGroupIndex: Map<string, TokenGroup>;
  remoteThemeIndex: Map<string, TokenTheme>;
  remoteTokenIndex: Map<string, AnyToken>;
  rootGroups: Map<TokenType, TokenGroup>;
}

export interface SyncSeedSpecs {
  groupSpecs: GroupSpec[];
  referenceIndex: Map<string, string>;
  themeSpecs: ThemeSpec[];
  tokenSpecs: TokenSpec[];
}

type SyncAction = "create" | "update";
type TokenIndex = Map<string, AnyToken>;

export interface ThemeOverrideSpec {
  apply: TokenValueApplier;
  tokenKey: string;
}

export interface ThemeSpec {
  codeName: string;
  name: string;
  values: ThemeOverrideSpec[];
}

export interface TokenSpec {
  apply: TokenValueApplier;
  groupPath: string[];
  key: string;
  name: string;
  referencePath: string;
  tokenType: TokenType;
}

export type TokenValueApplier = (
  token: AnyToken,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
) => void;

const dimensionPattern = /^(?<measure>-?\d*\.?\d+)(?<unit>px|rem|ms|%|raw)?$/i;
const gradientPattern =
  /^(?<kind>linear|radial|conic)-gradient\((?<body>.*)\)$/i;
const gradientAnglePattern = /^(?<angle>-?\d*\.?\d+)deg$/i;
const gradientPositionPattern =
  /\bat\s+(?<x>-?\d*\.?\d+)%\s+(?<y>-?\d*\.?\d+)%/i;
const whitespacePattern = /\s/;
const rgbColorPattern =
  /^rgba?\((?<r>[^,]+),\s*(?<g>[^,]+),\s*(?<b>[^,]+)(?:,\s*(?<a>[^)]+))?\)$/i;
const semanticColorPrefixPattern = /^color\./;
const semanticGradientPrefixPattern = /^gradient\./;
const shadcnVariablePrefixPattern = /^--/;
const shadowPattern =
  /^(?<x>-?\d*\.?\d+)(?:px)?\s+(?<y>-?\d*\.?\d+)(?:px)?\s+(?<radius>-?\d*\.?\d+)(?:px)?\s+(?<spread>-?\d*\.?\d+)(?:px)?\s+(?<color>.+)$/i;

export const tokenKeyFor = (
  tokenType: TokenType,
  groupPath: string[],
  name: string
): string => `${tokenType}|${[...groupPath, name].join("/")}`;

export const groupKeyFor = (tokenType: TokenType, path: string[]): string =>
  `${tokenType}|${path.join("/")}`;

const normalizePathSegmentIdentity = (segment: string): string =>
  segment.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase();

const tokenTypeRootSegments = new Map<TokenType, string[]>([
  [TokenType.blur, ["blur"]],
  [TokenType.border, ["border"]],
  [TokenType.borderWidth, ["borderWidth", "Border Width"]],
  [TokenType.color, ["color"]],
  [TokenType.duration, ["duration"]],
  [TokenType.gradient, ["gradient"]],
  [TokenType.opacity, ["opacity"]],
  [TokenType.radius, ["radius", "Border Radius"]],
  [TokenType.shadow, ["shadow"]],
  [TokenType.size, ["size"]],
  [TokenType.space, ["space"]],
  [TokenType.zIndex, ["zIndex", "Z Index"]],
]);

const collapseAdjacentDuplicates = (segments: string[]): string[] =>
  segments.reduce<string[]>((collapsed, segment) => {
    if (collapsed.at(-1) !== segment) {
      collapsed.push(segment);
    }

    return collapsed;
  }, []);

const normalizeManagedPath = (
  tokenType: TokenType,
  path: string[]
): string[] => {
  const collapsedPath = collapseAdjacentDuplicates(path.filter(Boolean));
  const redundantRootSegments = tokenTypeRootSegments.get(tokenType);

  if (collapsedPath.length === 0 || !redundantRootSegments) {
    return collapsedPath;
  }

  const redundantRootSegmentIdentities = new Set(
    redundantRootSegments.map(normalizePathSegmentIdentity)
  );

  return redundantRootSegmentIdentities.has(
    normalizePathSegmentIdentity(collapsedPath[0] ?? "")
  )
    ? collapsedPath.slice(1)
    : collapsedPath;
};

const joinReferencePath = (segments: string[]): string => segments.join(".");

const isTokenReference = (value: string): boolean =>
  value.startsWith("{") && value.endsWith("}");

const unwrapReference = (value: string): string => value.slice(1, -1);

const splitTopLevelCommaSeparated = (value: string): string[] => {
  const parts: string[] = [];
  let buffer = "";
  let depth = 0;

  for (const character of value) {
    if (character === "(") {
      depth += 1;
    } else if (character === ")") {
      depth -= 1;
    }

    if (character === "," && depth === 0) {
      parts.push(buffer.trim());
      buffer = "";
      continue;
    }

    buffer += character;
  }

  if (buffer.trim()) {
    parts.push(buffer.trim());
  }

  return parts;
};

const clampUnitInterval = (value: number): number =>
  Math.max(0, Math.min(1, Number(value.toFixed(4))));

const percentToUnitInterval = (value: string): number =>
  clampUnitInterval(Number.parseFloat(value) / 100);

const parseHexColor = (
  value: string
): { a: number; b: number; g: number; r: number } => {
  const normalized = value.replace("#", "").trim();

  if (normalized.length === 3) {
    const [r, g, b] = normalized.split("");

    return parseHexColor(`#${r}${r}${g}${g}${b}${b}`);
  }

  if (normalized.length !== 6 && normalized.length !== 8) {
    throw new Error(`Unsupported hex color format: ${value}`);
  }

  const alpha =
    normalized.length === 8
      ? Number.parseInt(normalized.slice(6, 8), 16) / 255
      : 1;

  return {
    a: Number(alpha.toFixed(4)),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    r: Number.parseInt(normalized.slice(0, 2), 16),
  };
};

const parseRgbColor = (
  value: string
): { a: number; b: number; g: number; r: number } => {
  const match = value.trim().match(rgbColorPattern);

  if (!match?.groups) {
    throw new Error(`Unsupported rgb color format: ${value}`);
  }

  return {
    a: match.groups.a ? Number.parseFloat(match.groups.a) : 1,
    b: Number.parseFloat(match.groups.b),
    g: Number.parseFloat(match.groups.g),
    r: Number.parseFloat(match.groups.r),
  };
};

const parseColorValue = (
  value: string
): { a: number; b: number; g: number; r: number } => {
  if (value.startsWith("#")) {
    return parseHexColor(value);
  }

  if (value.startsWith("rgb")) {
    return parseRgbColor(value);
  }

  throw new Error(`Unsupported color value: ${value}`);
};

const isGradientValue = (value: string): boolean =>
  gradientPattern.test(value.trim());

const createGradientStop = (
  rawColor: string,
  position: number
): MutableGradientStop => {
  const color = parseColorValue(rawColor.trim());

  return {
    color: {
      color: {
        b: color.b,
        g: color.g,
        r: color.r,
        referencedTokenId: null,
      },
      opacity: {
        measure: color.a,
        referencedTokenId: null,
        unit: Unit.raw,
      },
      referencedTokenId: null,
    },
    position,
  } satisfies MutableGradientStop;
};

const extractGradientStopParts = (
  rawStop: string
): { color: string; position?: number } => {
  let lastWhitespaceIndex = -1;
  let depth = 0;

  for (let index = 0; index < rawStop.length; index += 1) {
    const character = rawStop[index];

    if (character === "(") {
      depth += 1;
      continue;
    }

    if (character === ")") {
      depth -= 1;
      continue;
    }

    if (depth === 0 && whitespacePattern.test(character)) {
      lastWhitespaceIndex = index;
    }
  }

  if (lastWhitespaceIndex === -1) {
    return { color: rawStop.trim() };
  }

  const color = rawStop.slice(0, lastWhitespaceIndex).trim();
  const trailing = rawStop.slice(lastWhitespaceIndex).trim();

  if (!trailing.endsWith("%")) {
    return { color: rawStop.trim() };
  }

  return {
    color,
    position: percentToUnitInterval(trailing),
  };
};

const normalizeGradientStops = (rawStops: string[]): MutableGradientStop[] => {
  const parsedStops = rawStops.map((rawStop) =>
    extractGradientStopParts(rawStop)
  );

  return parsedStops.map((stop, index) => {
    const fallbackPosition =
      parsedStops.length === 1 ? 0 : index / (parsedStops.length - 1);

    return createGradientStop(stop.color, stop.position ?? fallbackPosition);
  });
};

const parseLinearGradientCoordinates = (value: string) => {
  const angleMatch = value.trim().match(gradientAnglePattern);
  const angle = angleMatch?.groups?.angle
    ? Number.parseFloat(angleMatch.groups.angle)
    : 180;
  const radians = (angle * Math.PI) / 180;
  const dx = Math.sin(radians);
  const dy = -Math.cos(radians);

  return {
    aspectRatio: 1,
    from: {
      x: clampUnitInterval(0.5 - dx / 2),
      y: clampUnitInterval(0.5 - dy / 2),
    },
    to: {
      x: clampUnitInterval(0.5 + dx / 2),
      y: clampUnitInterval(0.5 + dy / 2),
    },
    type: GradientType.linear,
  };
};

const parseRadialGradientCoordinates = (value: string) => {
  const match = value.match(gradientPositionPattern);
  const centerX = match?.groups?.x
    ? percentToUnitInterval(match.groups.x)
    : 0.5;
  const centerY = match?.groups?.y
    ? percentToUnitInterval(match.groups.y)
    : 0.5;

  return {
    aspectRatio: 1,
    from: {
      x: centerX,
      y: centerY,
    },
    to: {
      x: clampUnitInterval(centerX + 0.5),
      y: centerY,
    },
    type: GradientType.radial,
  };
};

const parseGradientValue = (value: string): MutableGradientToken["value"] => {
  const match = value.trim().match(gradientPattern);

  if (!match?.groups) {
    throw new Error(`Unsupported gradient value: ${value}`);
  }

  const { body, kind } = match.groups;
  const parts = splitTopLevelCommaSeparated(body);

  if (parts.length === 0) {
    throw new Error(`Gradient has no stops: ${value}`);
  }

  let config = "";
  let rawStops = parts;

  if (
    parts.length > 1 &&
    !parts[0].trim().startsWith("#") &&
    !parts[0].trim().startsWith("rgb")
  ) {
    [config, ...rawStops] = parts;
  }

  const coordinates =
    kind.toLowerCase() === "radial"
      ? parseRadialGradientCoordinates(config)
      : parseLinearGradientCoordinates(config);

  return [
    {
      ...coordinates,
      referencedTokenId: null,
      stops: normalizeGradientStops(rawStops),
    },
  ];
};

const normalizeDimensionUnit = (
  unit: string | undefined,
  fallbackUnit: Unit
): Unit => {
  if (!unit) {
    return fallbackUnit;
  }

  switch (unit.toLowerCase()) {
    case "ms":
      return Unit.ms;
    case "px":
      return Unit.pixels;
    case "%":
      return Unit.percent;
    case "raw":
      return Unit.raw;
    case "rem":
      return Unit.rem;
    default:
      return fallbackUnit;
  }
};

const parseDimensionValue = (
  value: number | string,
  fallbackUnit: Unit
): { measure: number; referencePath?: string; unit: Unit } => {
  if (typeof value === "number") {
    return {
      measure: value,
      unit: fallbackUnit,
    };
  }

  const trimmed = value.trim();

  if (isTokenReference(trimmed)) {
    return {
      measure: 0,
      referencePath: unwrapReference(trimmed),
      unit: fallbackUnit,
    };
  }

  const match = trimmed.match(dimensionPattern);

  if (!match?.groups) {
    throw new Error(`Unsupported dimension value: ${value}`);
  }

  return {
    measure: Number.parseFloat(match.groups.measure),
    unit: normalizeDimensionUnit(match.groups.unit, fallbackUnit),
  };
};

const resolveReferenceToken = (
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>,
  referencePath: string
): AnyToken => {
  const tokenKey = referenceIndex.get(referencePath);

  if (!tokenKey) {
    throw new Error(`Unable to resolve token reference: ${referencePath}`);
  }

  const token = tokenIndex.get(tokenKey);

  if (!token) {
    throw new Error(
      `Unable to resolve prepared token for reference: ${referencePath}`
    );
  }

  return token;
};

const applyColorValue = (
  token: AnyToken,
  rawValue: string,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  const mutableToken = token as MutableColorToken;

  if (isTokenReference(rawValue)) {
    const referencedToken = resolveReferenceToken(
      tokenIndex,
      referenceIndex,
      unwrapReference(rawValue)
    );

    mutableToken.value.color = {
      b: 255,
      g: 255,
      r: 255,
      referencedTokenId: null,
    };
    mutableToken.value.opacity = {
      measure: 1,
      referencedTokenId: null,
      unit: Unit.raw,
    };
    mutableToken.value.referencedTokenId = referencedToken.id;

    return;
  }

  const color = parseColorValue(rawValue);

  mutableToken.value.color = {
    b: color.b,
    g: color.g,
    r: color.r,
    referencedTokenId: null,
  };
  mutableToken.value.opacity = {
    measure: color.a,
    referencedTokenId: null,
    unit: Unit.raw,
  };
  mutableToken.value.referencedTokenId = null;
};

const applyGradientValue = (
  token: AnyToken,
  rawValue: string,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  const mutableToken = token as MutableGradientToken;

  if (isTokenReference(rawValue)) {
    mutableToken.value = [
      {
        aspectRatio: 1,
        from: { x: 0, y: 0 },
        referencedTokenId: resolveReferenceToken(
          tokenIndex,
          referenceIndex,
          unwrapReference(rawValue)
        ).id,
        stops: [],
        to: { x: 1, y: 1 },
        type: GradientType.linear,
      },
    ];

    return;
  }

  mutableToken.value = parseGradientValue(rawValue);
};

const applyDimensionValue = (
  token: AnyToken,
  rawValue: number | string,
  fallbackUnit: Unit,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  const mutableToken = token as MutableDimensionToken;
  const parsed = parseDimensionValue(rawValue, fallbackUnit);

  mutableToken.value.measure = parsed.measure;
  mutableToken.value.referencedTokenId = parsed.referencePath
    ? resolveReferenceToken(tokenIndex, referenceIndex, parsed.referencePath).id
    : null;
  mutableToken.value.unit = parsed.unit;
};

const applyStringValue = (
  token: AnyToken,
  rawValue: string,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  const mutableToken = token as MutableStringToken;

  if (isTokenReference(rawValue)) {
    mutableToken.value.referencedTokenId = resolveReferenceToken(
      tokenIndex,
      referenceIndex,
      unwrapReference(rawValue)
    ).id;
    mutableToken.value.text = "";

    return;
  }

  mutableToken.value.referencedTokenId = null;
  mutableToken.value.text = rawValue;
};

const applyBlurValue = (
  token: AnyToken,
  rawValue: string,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  const mutableToken = token as MutableBlurToken;
  const parsed = parseDimensionValue(rawValue, Unit.pixels);

  mutableToken.value.radius = {
    measure: parsed.measure,
    referencedTokenId: parsed.referencePath
      ? resolveReferenceToken(tokenIndex, referenceIndex, parsed.referencePath)
          .id
      : null,
    unit: parsed.unit,
  };
  mutableToken.value.referencedTokenId = null;
  mutableToken.value.type = BlurType.background;
};

const borderStyleMap: Record<string, BorderStyle> = {
  dashed: BorderStyle.dashed,
  dotted: BorderStyle.dotted,
  solid: BorderStyle.solid,
};

const applyBorderValue = (
  token: AnyToken,
  rawValue: SeedBorderToken,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  const mutableToken = token as MutableBorderToken;
  const parsedWidth = parseDimensionValue(rawValue.width, Unit.pixels);
  const styleKey = rawValue.style.trim().toLowerCase();

  mutableToken.value.position = BorderPosition.outside;
  mutableToken.value.referencedTokenId = null;
  mutableToken.value.style = borderStyleMap[styleKey] ?? BorderStyle.solid;
  mutableToken.value.width = {
    measure: parsedWidth.measure,
    referencedTokenId: parsedWidth.referencePath
      ? resolveReferenceToken(
          tokenIndex,
          referenceIndex,
          parsedWidth.referencePath
        ).id
      : null,
    unit: parsedWidth.unit,
  };

  if (isTokenReference(rawValue.color)) {
    mutableToken.value.color.color = {
      b: 0,
      g: 0,
      r: 0,
      referencedTokenId: null,
    };
    mutableToken.value.color.opacity = {
      measure: 1,
      referencedTokenId: null,
      unit: Unit.raw,
    };
    mutableToken.value.color.referencedTokenId = resolveReferenceToken(
      tokenIndex,
      referenceIndex,
      unwrapReference(rawValue.color)
    ).id;

    return;
  }

  const color = parseColorValue(rawValue.color);

  mutableToken.value.color.color = {
    b: color.b,
    g: color.g,
    r: color.r,
    referencedTokenId: null,
  };
  mutableToken.value.color.opacity = {
    measure: color.a,
    referencedTokenId: null,
    unit: Unit.raw,
  };
  mutableToken.value.color.referencedTokenId = null;
};

const applyShadowValue = (token: AnyToken, rawValue: string): void => {
  const mutableToken = token as unknown as { value: MutableShadowValue[] };

  if (rawValue.trim() === "none") {
    mutableToken.value = [createNoneShadowValue()];
    return;
  }

  mutableToken.value = splitTopLevelCommaSeparated(rawValue).map((part) => {
    const match = part.match(shadowPattern);

    if (!match?.groups) {
      throw new Error(`Unsupported shadow value: ${rawValue}`);
    }

    const color = parseColorValue(match.groups.color.trim());

    return {
      color: {
        color: {
          b: color.b,
          g: color.g,
          r: color.r,
          referencedTokenId: null,
        },
        opacity: {
          measure: color.a,
          referencedTokenId: null,
          unit: Unit.raw,
        },
        referencedTokenId: null,
      },
      radius: Number.parseFloat(match.groups.radius),
      referencedTokenId: null,
      spread: Number.parseFloat(match.groups.spread),
      type: ShadowType.drop,
      x: Number.parseFloat(match.groups.x),
      y: Number.parseFloat(match.groups.y),
    } satisfies MutableShadowValue;
  });
};

const addTokenSpec = (
  tokenSpecs: TokenSpec[],
  referenceIndex: Map<string, string>,
  spec: TokenSpec
): void => {
  tokenSpecs.push(spec);
  referenceIndex.set(spec.referencePath, spec.key);
};

const collectLeafTokenSpecs = (
  tokenSpecs: TokenSpec[],
  referenceIndex: Map<string, string>,
  tokenType: TokenType,
  basePath: string[],
  values: SeedTokenMap,
  applyFactory: (referencePath: string, rawValue: string) => TokenValueApplier
): void => {
  for (const [key, rawValue] of Object.entries(values)) {
    const parts = key.split(".");
    const groupPath = [...basePath, ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    const referencePath = joinReferencePath([...basePath, ...parts]);

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: applyFactory(referencePath, rawValue),
      groupPath,
      key: tokenKeyFor(tokenType, groupPath, name),
      name,
      referencePath,
      tokenType,
    });
  }
};

const inferShadcnTokenType = (
  variableName: string,
  value: string
): TokenType => {
  if (isGradientValue(value)) {
    return TokenType.gradient;
  }

  if (value.startsWith("#") || value.startsWith("rgb")) {
    return TokenType.color;
  }

  if (variableName === "radius") {
    return TokenType.radius;
  }

  return TokenType.string;
};

const addRawColorSpecs = (
  tokenSpecs: TokenSpec[],
  referenceIndex: Map<string, string>,
  colors: SupernovaFoundationsSeed["foundations"]["color"]["raw"]
): void => {
  for (const [paletteName, paletteColors] of Object.entries(colors)) {
    for (const [step, colorValue] of Object.entries(paletteColors)) {
      const groupPath = ["raw", paletteName];
      const referencePath = joinReferencePath(["color", ...groupPath, step]);

      addTokenSpec(tokenSpecs, referenceIndex, {
        apply: (token, tokenIndex, localReferenceIndex) =>
          applyColorValue(token, colorValue, tokenIndex, localReferenceIndex),
        groupPath,
        key: tokenKeyFor(TokenType.color, groupPath, step),
        name: step,
        referencePath,
        tokenType: TokenType.color,
      });
    }
  }
};

const addRawGradientSpecs = (
  tokenSpecs: TokenSpec[],
  referenceIndex: Map<string, string>,
  gradients: SeedTokenMap
): void => {
  for (const [gradientName, gradientValue] of Object.entries(gradients)) {
    const parts = gradientName.split(".");
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    const groupPath = ["raw", ...parts.slice(0, -1)];
    const referencePath = joinReferencePath(["gradient", ...groupPath, name]);

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyGradientValue(
          token,
          gradientValue,
          tokenIndex,
          localReferenceIndex
        ),
      groupPath,
      key: tokenKeyFor(TokenType.gradient, groupPath, name),
      name,
      referencePath,
      tokenType: TokenType.gradient,
    });
  }
};

const addSemanticColorSpecs = (
  tokenSpecs: TokenSpec[],
  lightValues: ThemeOverrideSpec[],
  darkValues: ThemeOverrideSpec[],
  referenceIndex: Map<string, string>,
  darkColors: SeedTokenMap,
  lightColors: SeedTokenMap
): void => {
  for (const [referencePath, colorValue] of Object.entries(lightColors)) {
    const semanticPath = referencePath.replace(semanticColorPrefixPattern, "");
    const parts = semanticPath.split(".");
    const groupPath = ["semantic", ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyColorValue(token, colorValue, tokenIndex, localReferenceIndex),
      groupPath,
      key: tokenKeyFor(TokenType.color, groupPath, name),
      name,
      referencePath,
      tokenType: TokenType.color,
    });
  }

  for (const [referencePath, colorValue] of Object.entries(lightColors)) {
    const semanticPath = referencePath.replace(semanticColorPrefixPattern, "");
    const parts = semanticPath.split(".");
    const groupPath = ["semantic", ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    lightValues.push({
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyColorValue(token, colorValue, tokenIndex, localReferenceIndex),
      tokenKey: tokenKeyFor(TokenType.color, groupPath, name),
    });
  }

  for (const [referencePath, colorValue] of Object.entries(darkColors)) {
    const semanticPath = referencePath.replace(semanticColorPrefixPattern, "");
    const parts = semanticPath.split(".");
    const groupPath = ["semantic", ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    darkValues.push({
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyColorValue(token, colorValue, tokenIndex, localReferenceIndex),
      tokenKey: tokenKeyFor(TokenType.color, groupPath, name),
    });
  }
};

const addSemanticGradientSpecs = (
  tokenSpecs: TokenSpec[],
  lightValues: ThemeOverrideSpec[],
  darkValues: ThemeOverrideSpec[],
  referenceIndex: Map<string, string>,
  darkGradients: SeedTokenMap,
  lightGradients: SeedTokenMap
): void => {
  for (const [referencePath, gradientValue] of Object.entries(lightGradients)) {
    const semanticPath = referencePath.replace(
      semanticGradientPrefixPattern,
      ""
    );
    const parts = semanticPath.split(".");
    const groupPath = ["semantic", ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyGradientValue(
          token,
          gradientValue,
          tokenIndex,
          localReferenceIndex
        ),
      groupPath,
      key: tokenKeyFor(TokenType.gradient, groupPath, name),
      name,
      referencePath,
      tokenType: TokenType.gradient,
    });
  }

  for (const [referencePath, gradientValue] of Object.entries(lightGradients)) {
    const semanticPath = referencePath.replace(
      semanticGradientPrefixPattern,
      ""
    );
    const parts = semanticPath.split(".");
    const groupPath = ["semantic", ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    lightValues.push({
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyGradientValue(
          token,
          gradientValue,
          tokenIndex,
          localReferenceIndex
        ),
      tokenKey: tokenKeyFor(TokenType.gradient, groupPath, name),
    });
  }

  for (const [referencePath, gradientValue] of Object.entries(darkGradients)) {
    const semanticPath = referencePath.replace(
      semanticGradientPrefixPattern,
      ""
    );
    const parts = semanticPath.split(".");
    const groupPath = ["semantic", ...parts.slice(0, -1)];
    const name = parts.at(-1);

    if (!name) {
      continue;
    }

    darkValues.push({
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyGradientValue(
          token,
          gradientValue,
          tokenIndex,
          localReferenceIndex
        ),
      tokenKey: tokenKeyFor(TokenType.gradient, groupPath, name),
    });
  }
};

const addFoundationValueSpecs = (
  tokenSpecs: TokenSpec[],
  referenceIndex: Map<string, string>,
  seed: SupernovaFoundationsSeed
): void => {
  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.space,
    [],
    seed.foundations.space,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyDimensionValue(
        token,
        rawValue,
        Unit.pixels,
        tokenIndex,
        localReferenceIndex
      )
  );

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.size,
    [],
    seed.foundations.size,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyDimensionValue(
        token,
        rawValue,
        Unit.pixels,
        tokenIndex,
        localReferenceIndex
      )
  );

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.radius,
    [],
    seed.foundations.radius,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyDimensionValue(
        token,
        rawValue,
        Unit.rem,
        tokenIndex,
        localReferenceIndex
      )
  );

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.borderWidth,
    [],
    seed.foundations.borderWidth,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyDimensionValue(
        token,
        rawValue,
        Unit.pixels,
        tokenIndex,
        localReferenceIndex
      )
  );

  for (const [name, borderValue] of Object.entries(
    seed.foundations.borderTokens
  )) {
    const groupPath: string[] = [];

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyBorderValue(token, borderValue, tokenIndex, localReferenceIndex),
      groupPath,
      key: tokenKeyFor(TokenType.border, groupPath, name),
      name,
      referencePath: joinReferencePath(["borderTokens", name]),
      tokenType: TokenType.border,
    });
  }

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.shadow,
    [],
    seed.foundations.shadow,
    (_referencePath, rawValue) => (token) => applyShadowValue(token, rawValue)
  );

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.blur,
    [],
    seed.foundations.blur,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyBlurValue(token, rawValue, tokenIndex, localReferenceIndex)
  );

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.opacity,
    [],
    seed.foundations.opacity,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyDimensionValue(
        token,
        rawValue,
        Unit.raw,
        tokenIndex,
        localReferenceIndex
      )
  );

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.duration,
    [],
    seed.foundations.duration,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyDimensionValue(
        token,
        rawValue,
        Unit.ms,
        tokenIndex,
        localReferenceIndex
      )
  );

  for (const [name, value] of Object.entries(seed.foundations.zIndex)) {
    const groupPath: string[] = [];

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyDimensionValue(
          token,
          value,
          Unit.raw,
          tokenIndex,
          localReferenceIndex
        ),
      groupPath,
      key: tokenKeyFor(TokenType.zIndex, groupPath, name),
      name,
      referencePath: joinReferencePath(["zIndex", name]),
      tokenType: TokenType.zIndex,
    });
  }

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.string,
    ["easing"],
    seed.foundations.easing,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyStringValue(token, rawValue, tokenIndex, localReferenceIndex)
  );

  if (!seed.foundations.layout) {
    return;
  }

  collectLeafTokenSpecs(
    tokenSpecs,
    referenceIndex,
    TokenType.string,
    ["layout"],
    seed.foundations.layout,
    (_referencePath, rawValue) => (token, tokenIndex, localReferenceIndex) =>
      applyStringValue(token, rawValue, tokenIndex, localReferenceIndex)
  );
};

const addShadcnVariableSpecs = (
  tokenSpecs: TokenSpec[],
  lightValues: ThemeOverrideSpec[],
  darkValues: ThemeOverrideSpec[],
  referenceIndex: Map<string, string>,
  darkVariables: SeedTokenMap,
  lightVariables: SeedTokenMap,
  referenceProperty: "shadcnGradientVariables" | "shadcnVariables"
): void => {
  const groupPath = ["implementation", "shadcn"];
  const applyValue = (
    inferredType: TokenType,
    token: AnyToken,
    value: string,
    tokenIndex: TokenIndex,
    localReferenceIndex: Map<string, string>
  ): void => {
    if (inferredType === TokenType.color) {
      applyColorValue(token, value, tokenIndex, localReferenceIndex);
      return;
    }

    if (inferredType === TokenType.gradient) {
      applyGradientValue(token, value, tokenIndex, localReferenceIndex);
      return;
    }

    if (inferredType === TokenType.radius) {
      applyDimensionValue(
        token,
        value,
        Unit.rem,
        tokenIndex,
        localReferenceIndex
      );
      return;
    }

    applyStringValue(token, value, tokenIndex, localReferenceIndex);
  };

  for (const [variableName, value] of Object.entries(lightVariables)) {
    const normalizedName = variableName.replace(
      shadcnVariablePrefixPattern,
      ""
    );
    const inferredType = inferShadcnTokenType(normalizedName, value);

    addTokenSpec(tokenSpecs, referenceIndex, {
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyValue(inferredType, token, value, tokenIndex, localReferenceIndex),
      groupPath,
      key: tokenKeyFor(inferredType, groupPath, normalizedName),
      name: normalizedName,
      referencePath: joinReferencePath([
        "themes",
        "light",
        referenceProperty,
        normalizedName,
      ]),
      tokenType: inferredType,
    });

    lightValues.push({
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyValue(inferredType, token, value, tokenIndex, localReferenceIndex),
      tokenKey: tokenKeyFor(inferredType, groupPath, normalizedName),
    });
  }

  for (const [variableName, value] of Object.entries(darkVariables)) {
    const normalizedName = variableName.replace(
      shadcnVariablePrefixPattern,
      ""
    );
    const inferredType = inferShadcnTokenType(normalizedName, value);

    darkValues.push({
      apply: (token, tokenIndex, localReferenceIndex) =>
        applyValue(inferredType, token, value, tokenIndex, localReferenceIndex),
      tokenKey: tokenKeyFor(inferredType, groupPath, normalizedName),
    });
  }
};

const collectGroupSpecs = (tokenSpecs: TokenSpec[]): GroupSpec[] =>
  Array.from(
    new Map(
      tokenSpecs.flatMap((spec) =>
        spec.groupPath.map((_, index) => {
          const path = spec.groupPath.slice(0, index + 1);
          const key = groupKeyFor(spec.tokenType, path);

          return [
            key,
            {
              key,
              path,
              tokenType: spec.tokenType,
            } satisfies GroupSpec,
          ] as const;
        })
      )
    ).values()
  );

export const collectSeedSpecs = (
  seed: SupernovaFoundationsSeed
): SyncSeedSpecs => {
  const tokenSpecs: TokenSpec[] = [];
  const referenceIndex = new Map<string, string>();
  const lightValues: ThemeOverrideSpec[] = [];
  const darkValues: ThemeOverrideSpec[] = [];
  const lightSemanticGradients =
    seed.themes.light.semanticGradientValues ??
    seed.foundations.gradient?.semantic?.light ??
    {};
  const darkSemanticGradients =
    seed.themes.dark.semanticGradientValues ??
    seed.foundations.gradient?.semantic?.dark ??
    {};

  addRawColorSpecs(tokenSpecs, referenceIndex, seed.foundations.color.raw);

  if (seed.foundations.gradient?.raw) {
    addRawGradientSpecs(
      tokenSpecs,
      referenceIndex,
      seed.foundations.gradient.raw
    );
  }

  addSemanticColorSpecs(
    tokenSpecs,
    lightValues,
    darkValues,
    referenceIndex,
    seed.themes.dark.semanticColorValues,
    seed.themes.light.semanticColorValues
  );

  if (
    Object.keys(lightSemanticGradients).length > 0 ||
    Object.keys(darkSemanticGradients).length > 0
  ) {
    addSemanticGradientSpecs(
      tokenSpecs,
      lightValues,
      darkValues,
      referenceIndex,
      darkSemanticGradients,
      lightSemanticGradients
    );
  }

  addFoundationValueSpecs(tokenSpecs, referenceIndex, seed);
  addShadcnVariableSpecs(
    tokenSpecs,
    lightValues,
    darkValues,
    referenceIndex,
    seed.themes.dark.shadcnVariables,
    seed.themes.light.shadcnVariables,
    "shadcnVariables"
  );

  if (
    seed.themes.light.shadcnGradientVariables ||
    seed.themes.dark.shadcnGradientVariables
  ) {
    addShadcnVariableSpecs(
      tokenSpecs,
      lightValues,
      darkValues,
      referenceIndex,
      seed.themes.dark.shadcnGradientVariables ?? {},
      seed.themes.light.shadcnGradientVariables ?? {},
      "shadcnGradientVariables"
    );
  }

  return {
    groupSpecs: collectGroupSpecs(tokenSpecs),
    referenceIndex,
    themeSpecs: [
      {
        codeName: "light",
        name: "Light",
        values: lightValues,
      },
      {
        codeName: "dark",
        name: "Dark",
        values: darkValues,
      },
    ],
    tokenSpecs,
  };
};

export const getRemoteGroupKey = (group: TokenGroup): string | null => {
  if (group.isRoot) {
    return null;
  }

  return groupKeyFor(
    group.tokenType,
    normalizeManagedPath(group.tokenType, [...group.path, group.name])
  );
};

export const getRemoteTokenKey = (
  token: Token,
  groupsById: Map<string, TokenGroup>
): string | null => {
  const tokenPath = token.tokenPath?.filter(Boolean) ?? [];
  const parentGroup = groupsById.get(token.parentGroupId);
  let logicalPath: string[];

  if (tokenPath.length > 0) {
    const normalizedTokenPath = normalizeManagedPath(
      token.tokenType,
      tokenPath
    );

    logicalPath =
      normalizedTokenPath.at(-1) === token.name
        ? normalizedTokenPath
        : normalizeManagedPath(token.tokenType, [...tokenPath, token.name]);
  } else if (parentGroup && !parentGroup.isRoot) {
    logicalPath = normalizeManagedPath(token.tokenType, [
      ...parentGroup.path,
      parentGroup.name,
      token.name,
    ]);
  } else {
    logicalPath = normalizeManagedPath(token.tokenType, [token.name]);
  }

  const name = logicalPath.at(-1);

  if (!name) {
    return null;
  }

  return tokenKeyFor(token.tokenType, logicalPath.slice(0, -1), name);
};

const getRootGroupIndex = (
  groups: TokenGroup[]
): Map<TokenType, TokenGroup> => {
  const index = new Map<TokenType, TokenGroup>();

  for (const group of groups) {
    if (group.isRoot) {
      index.set(group.tokenType, group);
    }
  }

  return index;
};

const compareNullableDates = (
  left: Date | null,
  right: Date | null
): number => {
  const leftTime = left?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const rightTime = right?.getTime() ?? Number.MAX_SAFE_INTEGER;

  return leftTime - rightTime;
};

const compareStableIds = (
  left: { id: string; idInVersion: string },
  right: { id: string; idInVersion: string }
): number => {
  const versionIdComparison = left.idInVersion.localeCompare(right.idInVersion);

  if (versionIdComparison !== 0) {
    return versionIdComparison;
  }

  return left.id.localeCompare(right.id);
};

const selectCanonicalGroup = (groups: TokenGroup[]): TokenGroup =>
  [...groups].sort((left, right) => {
    const createdAtComparison = compareNullableDates(
      left.createdAt,
      right.createdAt
    );

    if (createdAtComparison !== 0) {
      return createdAtComparison;
    }

    const updatedAtComparison = compareNullableDates(
      left.updatedAt,
      right.updatedAt
    );

    if (updatedAtComparison !== 0) {
      return updatedAtComparison;
    }

    return compareStableIds(left, right);
  })[0];

const selectCanonicalTheme = (themes: TokenTheme[]): TokenTheme =>
  [...themes].sort((left, right) => {
    const createdAtComparison = compareNullableDates(
      left.createdAt,
      right.createdAt
    );

    if (createdAtComparison !== 0) {
      return createdAtComparison;
    }

    const updatedAtComparison = compareNullableDates(
      left.updatedAt,
      right.updatedAt
    );

    if (updatedAtComparison !== 0) {
      return updatedAtComparison;
    }

    return compareStableIds(left, right);
  })[0];

const selectCanonicalToken = (
  tokenKey: string,
  tokens: AnyToken[],
  groupsById: Map<string, TokenGroup>,
  canonicalGroups: Map<string, TokenGroup>
): AnyToken => {
  const [tokenType, tokenPath = ""] = tokenKey.split("|", 2);
  const tokenSegments = tokenPath.split("/").filter(Boolean);
  const parentGroupKey = groupKeyFor(
    tokenType as TokenType,
    tokenSegments.slice(0, -1)
  );
  const canonicalGroup = canonicalGroups.get(parentGroupKey);

  return [...tokens].sort((left, right) => {
    const leftParentMatch = canonicalGroup
      ? left.parentGroupId === canonicalGroup.id
      : false;
    const rightParentMatch = canonicalGroup
      ? right.parentGroupId === canonicalGroup.id
      : false;

    if (leftParentMatch !== rightParentMatch) {
      return leftParentMatch ? -1 : 1;
    }

    const leftResolvedPath = getRemoteTokenKey(left, groupsById) === tokenKey;
    const rightResolvedPath = getRemoteTokenKey(right, groupsById) === tokenKey;

    if (leftResolvedPath !== rightResolvedPath) {
      return leftResolvedPath ? -1 : 1;
    }

    const createdAtComparison = compareNullableDates(
      left.createdAt,
      right.createdAt
    );

    if (createdAtComparison !== 0) {
      return createdAtComparison;
    }

    const updatedAtComparison = compareNullableDates(
      left.updatedAt,
      right.updatedAt
    );

    if (updatedAtComparison !== 0) {
      return updatedAtComparison;
    }

    return compareStableIds(left, right);
  })[0];
};

const groupByKey = <T>(
  entries: T[],
  keySelector: (entry: T) => string | null
): Map<string, T[]> => {
  const index = new Map<string, T[]>();

  for (const entry of entries) {
    const key = keySelector(entry);

    if (!key) {
      continue;
    }

    const groupedEntries = index.get(key);

    if (groupedEntries) {
      groupedEntries.push(entry);
      continue;
    }

    index.set(key, [entry]);
  }

  return index;
};

const configureGroup = (
  group: TokenGroup,
  name: string,
  parentId: string,
  path: string[],
  sortOrder: number
): void => {
  group.description = "";
  group.name = name;
  group.setParentGroupId(parentId);
  group.setPath(path.slice(0, -1));
  group.setSortOrder(sortOrder);
};

const configureToken = (
  token: AnyToken,
  name: string,
  parentId: string,
  tokenPath: string[],
  sortOrder: number
): void => {
  token.description = "";
  token.name = name;
  token.setParentGroupId(parentId);
  token.setSortOrder(sortOrder);
  token.setTokenPath(tokenPath);
};

const resolveTokenParentGroup = (
  rootGroups: Map<TokenType, TokenGroup>,
  preparedGroups: PreparedGroupsResult,
  spec: TokenSpec
): TokenGroup => {
  if (spec.groupPath.length === 0) {
    const rootGroup = rootGroups.get(spec.tokenType);

    if (!rootGroup) {
      throw new Error(
        `Missing root token group for ${spec.tokenType}. Create it in Supernova before syncing.`
      );
    }

    return rootGroup;
  }

  const groupKey = groupKeyFor(spec.tokenType, spec.groupPath);
  const parentGroup = preparedGroups.index.get(groupKey)?.group;

  if (!parentGroup) {
    throw new Error(
      `Unable to resolve token group ${spec.groupPath.join(".")} for ${spec.referencePath}`
    );
  }

  return parentGroup;
};

const configureTheme = (theme: TokenTheme, spec: ThemeSpec): void => {
  theme.codeName = spec.codeName;
  theme.description = "";
  theme.name = spec.name;
  theme.overriddenTokens = [];
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

const summarizePreparedSync = (prepared: PreparedSync): void => {
  const createdGroups = prepared.groups
    .filter((group) => group.action === "create")
    .map((group) => group.spec.path.join(" / "));
  const updatedGroups = prepared.groups
    .filter((group) => group.action === "update")
    .map((group) => group.spec.path.join(" / "));
  const createdTokens = prepared.tokens
    .filter((token) => token.action === "create")
    .map((token) => token.spec.referencePath);
  const updatedTokens = prepared.tokens
    .filter((token) => token.action === "update")
    .map((token) => token.spec.referencePath);
  const createdThemes = prepared.themes
    .filter((theme) => theme.action === "create")
    .map((theme) => theme.spec.codeName);
  const updatedThemes = prepared.themes
    .filter((theme) => theme.action === "update")
    .map((theme) => theme.spec.codeName);

  console.log(
    `Supernova sync plan for brand ${prepared.brand.name} (${prepared.brand.id})`
  );
  console.log(`- groups: ${prepared.groups.length}`);
  console.log(`  - create: ${createdGroups.length}`);
  console.log(previewItems(createdGroups));
  console.log(`  - update: ${updatedGroups.length}`);
  console.log(previewItems(updatedGroups));
  console.log(`- tokens: ${prepared.tokens.length}`);
  console.log(`  - create: ${createdTokens.length}`);
  console.log(previewItems(createdTokens));
  console.log(`  - update: ${updatedTokens.length}`);
  console.log(previewItems(updatedTokens));
  console.log(`- themes: ${prepared.themes.length}`);
  console.log(`  - create: ${createdThemes.length}`);
  console.log(previewItems(createdThemes));
  console.log(`  - update: ${updatedThemes.length}`);
  console.log(previewItems(updatedThemes));
};

const createRemoteState = (
  remoteGroups: TokenGroup[],
  remoteThemes: TokenTheme[],
  remoteTokens: Token[]
): SyncRemoteState => {
  const groupsById = new Map(remoteGroups.map((group) => [group.id, group]));
  const remoteGroupIndex = new Map<string, TokenGroup>(
    Array.from(groupByKey(remoteGroups, getRemoteGroupKey)).map(
      ([key, groups]) => [key, selectCanonicalGroup(groups)] as const
    )
  );
  const remoteTokenIndex = new Map<string, AnyToken>(
    Array.from(
      groupByKey(remoteTokens as AnyToken[], (token) =>
        getRemoteTokenKey(token, groupsById)
      )
    ).map(
      ([key, tokens]) =>
        [
          key,
          selectCanonicalToken(key, tokens, groupsById, remoteGroupIndex),
        ] as const
    )
  );

  return {
    groupsById,
    remoteGroupIndex,
    remoteThemeIndex: new Map(
      Array.from(groupByKey(remoteThemes, (theme) => theme.codeName)).map(
        ([codeName, themes]) =>
          [codeName, selectCanonicalTheme(themes)] as const
      )
    ),
    remoteTokenIndex,
    rootGroups: getRootGroupIndex(remoteGroups),
  };
};

const prepareGroups = (
  sdk: Supernova,
  brand: Brand,
  remoteState: SyncRemoteState,
  remoteVersion: RemoteVersionIdentifier,
  groupSpecs: GroupSpec[]
): PreparedGroupsResult => {
  const groups: PreparedGroup[] = [];
  const index = new Map<string, PreparedGroup>();
  const siblingOrderByParent = new Map<string, number>();

  for (const spec of groupSpecs) {
    const rootGroup = remoteState.rootGroups.get(spec.tokenType);

    if (!rootGroup) {
      throw new Error(
        `Missing root token group for ${spec.tokenType}. Create it in Supernova before syncing.`
      );
    }

    const parentGroupKey =
      spec.path.length > 1
        ? groupKeyFor(spec.tokenType, spec.path.slice(0, -1))
        : null;

    if (parentGroupKey && !index.get(parentGroupKey)?.group.id) {
      throw new Error(
        `Unable to resolve parent token group for ${spec.path.join(".")}`
      );
    }

    const siblingParentKey = parentGroupKey ?? `root:${spec.tokenType}`;
    const siblingOrder = siblingOrderByParent.get(siblingParentKey) ?? 0;
    siblingOrderByParent.set(siblingParentKey, siblingOrder + 1);

    const existingGroup = remoteState.remoteGroupIndex.get(spec.key);
    const group =
      existingGroup ??
      sdk.tokens.createLocalTokenGroup(
        spec.tokenType,
        remoteVersion.versionId,
        brand.id
      );
    const name = spec.path.at(-1);

    if (!name) {
      throw new Error(`Unable to resolve group name for ${spec.key}`);
    }

    configureGroup(group, name, rootGroup.id, spec.path, siblingOrder);

    const preparedGroup: PreparedGroup = {
      action: existingGroup ? "update" : "create",
      group,
      parentGroupKey,
      siblingOrder,
      spec,
    };

    groups.push(preparedGroup);
    index.set(spec.key, preparedGroup);
    remoteState.groupsById.set(group.id, group);
  }

  return {
    groups,
    index,
  };
};

const prepareTokens = (
  sdk: Supernova,
  brand: Brand,
  remoteState: SyncRemoteState,
  remoteVersion: RemoteVersionIdentifier,
  properties: Awaited<ReturnType<Supernova["tokens"]["getTokenProperties"]>>,
  preparedGroups: PreparedGroupsResult,
  tokenSpecs: TokenSpec[]
): { tokenIndex: TokenIndex; tokens: PreparedToken[] } => {
  const tokenIndex: TokenIndex = new Map();
  const tokens: PreparedToken[] = [];
  const siblingOrderByGroup = new Map<string, number>();

  for (const spec of tokenSpecs) {
    const groupKey =
      spec.groupPath.length === 0
        ? null
        : groupKeyFor(spec.tokenType, spec.groupPath);
    const parentGroup = resolveTokenParentGroup(
      remoteState.rootGroups,
      preparedGroups,
      spec
    );

    const siblingKey = groupKey ?? `root:${spec.tokenType}`;
    const siblingOrder = siblingOrderByGroup.get(siblingKey) ?? 0;
    siblingOrderByGroup.set(siblingKey, siblingOrder + 1);

    const existingToken = remoteState.remoteTokenIndex.get(spec.key);
    const token =
      existingToken ??
      sdk.tokens.createLocalToken(
        spec.tokenType,
        remoteVersion.versionId,
        brand.id,
        properties
      );

    configureToken(
      token,
      spec.name,
      parentGroup.id,
      spec.groupPath,
      siblingOrder
    );

    tokens.push({
      action: existingToken ? "update" : "create",
      groupKey,
      siblingOrder,
      spec,
      token,
    });
    tokenIndex.set(spec.key, token);
  }

  return {
    tokenIndex,
    tokens,
  };
};

const applyPreparedTokenValues = (
  preparedTokens: PreparedToken[],
  referenceIndex: Map<string, string>,
  tokenIndex: TokenIndex
): void => {
  for (const preparedToken of preparedTokens) {
    preparedToken.spec.apply(preparedToken.token, tokenIndex, referenceIndex);
  }
};

const prepareThemes = (
  sdk: Supernova,
  brand: Brand,
  remoteState: SyncRemoteState,
  remoteVersion: RemoteVersionIdentifier,
  themeSpecs: ThemeSpec[]
): PreparedTheme[] => {
  const themes: PreparedTheme[] = [];

  for (const spec of themeSpecs) {
    const existingTheme = remoteState.remoteThemeIndex.get(spec.codeName);
    const theme =
      existingTheme ??
      sdk.tokens.createLocalTokenTheme(remoteVersion.versionId, brand.id);

    configureTheme(theme, spec);

    themes.push({
      action: existingTheme ? "update" : "create",
      spec,
      theme,
    });
  }

  return themes;
};

const prepareSync = async (
  sdk: Supernova,
  seed: SupernovaFoundationsSeed,
  remoteVersion: RemoteVersionIdentifier,
  brand: Brand
): Promise<PreparedSync> => {
  const [seedSpecs, properties, remoteGroups, remoteThemes, remoteTokens] =
    await Promise.all([
      Promise.resolve(collectSeedSpecs(seed)),
      sdk.tokens.getTokenProperties(remoteVersion),
      sdk.tokens.getTokenGroups(remoteVersion, { brandId: brand.id }),
      sdk.tokens.getTokenThemes(remoteVersion, { brandId: brand.id }),
      sdk.tokens.getTokens(remoteVersion, { brandId: brand.id }),
    ]);
  const remoteState = createRemoteState(
    remoteGroups,
    remoteThemes,
    remoteTokens
  );
  const preparedGroups = prepareGroups(
    sdk,
    brand,
    remoteState,
    remoteVersion,
    seedSpecs.groupSpecs
  );
  const preparedTokens = prepareTokens(
    sdk,
    brand,
    remoteState,
    remoteVersion,
    properties,
    preparedGroups,
    seedSpecs.tokenSpecs
  );

  const preparedThemes = prepareThemes(
    sdk,
    brand,
    remoteState,
    remoteVersion,
    seedSpecs.themeSpecs
  );

  return {
    brand,
    groups: preparedGroups.groups,
    groupIndex: preparedGroups.index,
    referenceIndex: seedSpecs.referenceIndex,
    remoteVersion,
    rootGroups: remoteState.rootGroups,
    themes: preparedThemes,
    tokenIndex: preparedTokens.tokenIndex,
    tokens: preparedTokens.tokens,
  };
};

const resolvePreparedGroupParentId = (
  prepared: PreparedSync,
  item: PreparedGroup
): string => {
  if (!item.parentGroupKey) {
    const rootGroup = prepared.rootGroups.get(item.spec.tokenType);

    if (!rootGroup) {
      throw new Error(
        `Missing root token group for ${item.spec.tokenType}. Create it in Supernova before syncing.`
      );
    }

    return rootGroup.id;
  }

  const parentGroup = prepared.groupIndex.get(item.parentGroupKey)?.group;

  if (!parentGroup) {
    throw new Error(
      `Unable to resolve parent token group for ${item.spec.path.join(".")}`
    );
  }

  return parentGroup.id;
};

const writePreparedGroups = async (
  sdk: Supernova,
  prepared: PreparedSync
): Promise<void> => {
  for (const item of prepared.groups) {
    const parentId = resolvePreparedGroupParentId(prepared, item);
    const name = item.spec.path.at(-1);

    if (!name) {
      throw new Error(`Unable to resolve group name for ${item.spec.key}`);
    }

    configureGroup(
      item.group,
      name,
      parentId,
      item.spec.path,
      item.siblingOrder
    );

    if (item.action === "create") {
      const created = await sdk.tokens.createTokenGroup(
        prepared.remoteVersion,
        item.group,
        parentId
      );

      item.group.id = created.id;
      item.group.idInVersion = created.idInVersion;
      continue;
    }

    await sdk.tokens.updateTokenGroup(prepared.remoteVersion, item.group);
  }
};

const createPreparedTokens = async (
  sdk: Supernova,
  prepared: PreparedSync
): Promise<void> => {
  for (const item of prepared.tokens) {
    if (item.action !== "create") {
      continue;
    }

    const parentGroup = resolveTokenParentGroup(
      prepared.rootGroups,
      { groups: prepared.groups, index: prepared.groupIndex },
      item.spec
    );

    configureToken(
      item.token,
      item.spec.name,
      parentGroup.id,
      item.spec.groupPath,
      item.siblingOrder
    );

    const created = await sdk.tokens.createToken(
      prepared.remoteVersion,
      item.token,
      parentGroup.id
    );

    item.token.id = created.id;
    item.token.idInVersion = created.idInVersion;
  }
};

const updatePreparedTokens = async (
  sdk: Supernova,
  prepared: PreparedSync
): Promise<void> => {
  for (const item of prepared.tokens) {
    const parentGroup = resolveTokenParentGroup(
      prepared.rootGroups,
      { groups: prepared.groups, index: prepared.groupIndex },
      item.spec
    );

    configureToken(
      item.token,
      item.spec.name,
      parentGroup.id,
      item.spec.groupPath,
      item.siblingOrder
    );

    await sdk.tokens.updateToken(prepared.remoteVersion, item.token);
  }
};

const applyPreparedThemeOverrides = (
  sdk: Supernova,
  preparedTheme: PreparedTheme,
  tokenIndex: TokenIndex,
  referenceIndex: Map<string, string>
): void => {
  configureTheme(preparedTheme.theme, preparedTheme.spec);

  for (const overrideSpec of preparedTheme.spec.values) {
    const baseToken = tokenIndex.get(overrideSpec.tokenKey);

    if (!baseToken) {
      throw new Error(
        `Unable to resolve base token for theme override ${overrideSpec.tokenKey}`
      );
    }

    const overrideToken = sdk.tokens.createLocalThemeOverride(
      preparedTheme.theme,
      baseToken
    );

    configureToken(
      overrideToken,
      baseToken.name,
      baseToken.parentGroupId,
      baseToken.tokenPath ?? [],
      baseToken.sortOrder
    );
    overrideSpec.apply(overrideToken, tokenIndex, referenceIndex);
    preparedTheme.theme.addOverride(overrideToken);
  }
};

const writePreparedThemes = async (
  sdk: Supernova,
  prepared: PreparedSync
): Promise<void> => {
  for (const item of prepared.themes) {
    applyPreparedThemeOverrides(
      sdk,
      item,
      prepared.tokenIndex,
      prepared.referenceIndex
    );

    if (item.action === "create") {
      const created = await sdk.tokens.createTokenTheme(
        prepared.remoteVersion,
        item.theme
      );

      item.theme.id = created.id;
      item.theme.idInVersion = created.idInVersion;
      continue;
    }

    await sdk.tokens.updateTokenTheme(prepared.remoteVersion, item.theme);
  }
};

export const syncFoundations = async (
  sdk: Supernova,
  seed: SupernovaFoundationsSeed,
  remoteVersion: RemoteVersionIdentifier,
  brand: Brand,
  options: SyncOptions = {}
): Promise<void> => {
  const prepared = await prepareSync(sdk, seed, remoteVersion, brand);

  summarizePreparedSync(prepared);

  if (options.dryRun) {
    console.log("Dry run complete. No changes were written to Supernova.");
    return;
  }

  await writePreparedGroups(sdk, prepared);
  await createPreparedTokens(sdk, prepared);
  applyPreparedTokenValues(
    prepared.tokens,
    prepared.referenceIndex,
    prepared.tokenIndex
  );
  await updatePreparedTokens(sdk, prepared);
  await writePreparedThemes(sdk, prepared);

  console.log("Supernova sync completed.");
};
