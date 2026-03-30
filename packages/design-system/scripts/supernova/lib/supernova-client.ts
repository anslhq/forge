import {
  type Brand,
  type DesignSystemVersion,
  type RemoteVersionIdentifier,
  Supernova,
} from "@supernovaio/sdk";

export interface SupernovaSyncConfig {
  apiKey: string;
  apiUrl?: string;
  brandId?: string;
  brandName?: string;
  designSystemId: string;
  versionId?: string;
}

const readRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const readOptionalEnv = (name: string): string | undefined => {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
};

export const readSupernovaSyncConfig = (): SupernovaSyncConfig => ({
  apiKey: readRequiredEnv("SUPERNOVA_API_KEY"),
  apiUrl: readOptionalEnv("SUPERNOVA_API_URL"),
  designSystemId: readRequiredEnv("SUPERNOVA_DESIGN_SYSTEM_ID"),
  versionId: readOptionalEnv("SUPERNOVA_VERSION_ID"),
  brandId: readOptionalEnv("SUPERNOVA_BRAND_ID"),
  brandName: readOptionalEnv("SUPERNOVA_BRAND_NAME"),
});

export const createSupernovaClient = (config: SupernovaSyncConfig): Supernova =>
  new Supernova(config.apiKey, config.apiUrl ? { apiUrl: config.apiUrl } : {});

export const resolveVersion = async (
  sdk: Supernova,
  config: SupernovaSyncConfig
): Promise<{
  version: DesignSystemVersion;
  remoteVersion: RemoteVersionIdentifier;
}> => {
  const version = config.versionId
    ? await sdk.versions.getVersion({
        designSystemId: config.designSystemId,
        versionId: config.versionId,
      })
    : await sdk.versions.getActiveVersion(config.designSystemId);

  if (!version) {
    throw new Error(
      `Unable to resolve a version for design system ${config.designSystemId}`
    );
  }

  return {
    version,
    remoteVersion: {
      designSystemId: config.designSystemId,
      versionId: version.id,
    },
  };
};

export const resolveBrand = async (
  sdk: Supernova,
  remoteVersion: RemoteVersionIdentifier,
  config: SupernovaSyncConfig
): Promise<Brand> => {
  const brands = await sdk.brands.getBrands(remoteVersion);

  if (config.brandId) {
    const matchedBrand = brands.find((brand) => brand.id === config.brandId);

    if (!matchedBrand) {
      throw new Error(
        `Unable to find brand ${config.brandId} in version ${remoteVersion.versionId}`
      );
    }

    return matchedBrand;
  }

  if (config.brandName) {
    const matchedBrand = brands.find(
      (brand) => brand.name.toLowerCase() === config.brandName?.toLowerCase()
    );

    if (matchedBrand) {
      return matchedBrand;
    }

    return sdk.brands.createBrand(remoteVersion, {
      name: config.brandName,
    });
  }

  if (brands.length === 1) {
    return brands[0];
  }

  if (brands.length === 0) {
    throw new Error(
      "No brand exists in the target version. Set SUPERNOVA_BRAND_NAME to create one."
    );
  }

  throw new Error(
    "Multiple brands exist in the target version. Set SUPERNOVA_BRAND_ID or SUPERNOVA_BRAND_NAME."
  );
};
