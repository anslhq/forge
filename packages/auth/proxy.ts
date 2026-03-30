import {
  type ClerkMiddlewareAuth,
  clerkMiddleware,
} from "@clerk/nextjs/server";
import type { NextMiddleware } from "next/server";
import {
  DEVELOPMENT_EMAIL,
  DEVELOPMENT_ORG_ID,
  DEVELOPMENT_USER_ID,
  isDevelopmentAuthFallback,
} from "./config";

type AuthMiddlewareHandler = (
  auth: ClerkMiddlewareAuth,
  request: Parameters<NextMiddleware>[0],
  event: Parameters<NextMiddleware>[1]
) => ReturnType<NextMiddleware>;

const createDevelopmentAuth = () =>
  ({
    userId: DEVELOPMENT_USER_ID,
    orgId: DEVELOPMENT_ORG_ID,
    orgRole: "org:admin",
    orgSlug: "development",
    sessionId: "development-session",
    actor: null,
    sessionClaims: null,
    getToken: async () => null,
    has: () => true,
    debug: () => null,
    redirectToSignIn: () => {
      throw new Error(
        `Authentication is not configured. Add Clerk keys to enable access for ${DEVELOPMENT_EMAIL}.`
      );
    },
    redirectToSignUp: () => {
      throw new Error(
        "Authentication is not configured. Add Clerk keys to enable sign-up."
      );
    },
  }) as unknown as Awaited<ReturnType<ClerkMiddlewareAuth>>;

const developmentAuth = (async () =>
  createDevelopmentAuth()) as ClerkMiddlewareAuth;

developmentAuth.protect = (async () =>
  createDevelopmentAuth()) as ClerkMiddlewareAuth["protect"];

export const authMiddleware = (
  handler: AuthMiddlewareHandler
): NextMiddleware => {
  if (!isDevelopmentAuthFallback()) {
    return clerkMiddleware(handler as never);
  }

  return (async (
    request: Parameters<NextMiddleware>[0],
    event: Parameters<NextMiddleware>[1]
  ) => handler(developmentAuth, request, event)) as NextMiddleware;
};
