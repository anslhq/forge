import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const defaultSeedPath = resolve(
  currentDirectory,
  "../../../supernova/seed/foundations.v1.json"
);

export type SeedTokenMap = Record<string, string>;

export interface SeedBorderToken {
  color: string;
  style: string;
  width: string;
}

export interface SeedFoundations {
  blur: SeedTokenMap;
  borderTokens: Record<string, SeedBorderToken>;
  borderWidth: SeedTokenMap;
  color: {
    raw: Record<string, SeedTokenMap>;
  };
  duration: SeedTokenMap;
  easing: SeedTokenMap;
  gradient?: {
    raw: SeedTokenMap;
    semantic?: {
      dark: SeedTokenMap;
      light: SeedTokenMap;
    };
    usageNotes?: SeedTokenMap;
  };
  layout?: SeedTokenMap;
  opacity: SeedTokenMap;
  radius: SeedTokenMap;
  shadow: SeedTokenMap;
  size: SeedTokenMap;
  space: SeedTokenMap;
  zIndex: Record<string, number>;
}

export interface SeedTheme {
  semanticColorValues: SeedTokenMap;
  semanticGradientValues?: SeedTokenMap;
  shadcnGradientVariables?: SeedTokenMap;
  shadcnVariables: SeedTokenMap;
}

export interface SupernovaFoundationsSeed {
  foundations: SeedFoundations;
  themes: {
    light: SeedTheme;
    dark: SeedTheme;
  };
}

export const readSeed = async (
  seedPath = defaultSeedPath
): Promise<SupernovaFoundationsSeed> => {
  const fileContents = await readFile(seedPath, "utf8");

  return JSON.parse(fileContents) as SupernovaFoundationsSeed;
};
