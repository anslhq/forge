import { keys as analytics } from "@platform/analytics/keys";
import { keys as auth } from "@platform/auth/keys";
import { keys as backend } from "@platform/backend/keys";
import { keys as collaboration } from "@platform/collaboration/keys";
import { keys as email } from "@platform/email/keys";
import { keys as flags } from "@platform/feature-flags/keys";
import { keys as core } from "@platform/next-config/keys";
import { keys as notifications } from "@platform/notifications/keys";
import { keys as observability } from "@platform/observability/keys";
import { keys as payments } from "@platform/payments/keys";
import { keys as security } from "@platform/security/keys";
import { keys as webhooks } from "@platform/webhooks/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  extends: [
    auth(),
    analytics(),
    backend(),
    collaboration(),
    core(),
    email(),
    flags(),
    notifications(),
    observability(),
    payments(),
    security(),
    webhooks(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
