const emptyToUndefined = (value?: string | null) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

export const getOptionalEnv = (value?: string | null) =>
  emptyToUndefined(value);

export const isClerkConfigured = () =>
  Boolean(
    getOptionalEnv(process.env.CLERK_SECRET_KEY) &&
      getOptionalEnv(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  );

export const isDevelopmentAuthFallback = () =>
  process.env.NODE_ENV !== "production" && !isClerkConfigured();

export const DEVELOPMENT_USER_ID = "dev-user";
export const DEVELOPMENT_ORG_ID = "dev-org";
export const DEVELOPMENT_EMAIL = "developer@example.local";
