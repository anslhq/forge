import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const getOptionalEnv = (value?: string | null) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_CONVEX_URL: z.url().optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_CONVEX_URL: getOptionalEnv(
        process.env.NEXT_PUBLIC_CONVEX_URL
      ),
    },
  });
