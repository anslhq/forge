import { keys as email } from "@platform/email/keys";
import { keys as flags } from "@platform/feature-flags/keys";
import { keys as core } from "@platform/next-config/keys";
import { keys as observability } from "@platform/observability/keys";
import { keys as rateLimit } from "@platform/rate-limit/keys";
import { keys as security } from "@platform/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  extends: [core(), email(), observability(), flags(), security(), rateLimit()],
  server: {},
  client: {},
  runtimeEnv: {},
});
