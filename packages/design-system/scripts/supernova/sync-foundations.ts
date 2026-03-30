import { readSeed } from "./lib/read-seed";
import {
  createSupernovaClient,
  readSupernovaSyncConfig,
  resolveBrand,
  resolveVersion,
} from "./lib/supernova-client";
import { syncFoundations } from "./lib/sync-foundations";

const main = async (): Promise<void> => {
  const config = readSupernovaSyncConfig();
  const sdk = createSupernovaClient(config);
  const seed = await readSeed();
  const { remoteVersion } = await resolveVersion(sdk, config);
  const brand = await resolveBrand(sdk, remoteVersion, config);
  const dryRun = process.argv.includes("--dry-run");

  await syncFoundations(sdk, seed, remoteVersion, brand, { dryRun });
};

await main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(message);
  process.exitCode = 1;
});
