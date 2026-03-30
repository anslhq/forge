import "server-only";
import {
  auth as clerkAuth,
  currentUser as clerkCurrentUser,
  clerkClient as createClerkClient,
} from "@clerk/nextjs/server";
import {
  DEVELOPMENT_EMAIL,
  DEVELOPMENT_ORG_ID,
  DEVELOPMENT_USER_ID,
  isDevelopmentAuthFallback,
} from "./config";

export type {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembership,
  OrganizationMembershipJSON,
  UserJSON,
  WebhookEvent,
} from "@clerk/nextjs/server";

type AuthResult = Awaited<ReturnType<typeof clerkAuth>>;
type CurrentUserResult = Awaited<ReturnType<typeof clerkCurrentUser>>;
type ClerkClientResult = Awaited<ReturnType<typeof createClerkClient>>;

const missingClerkRedirect = () => {
  throw new Error(
    "Authentication is not configured. Add Clerk environment variables to enable this flow."
  );
};

const createDevelopmentAuth = (): AuthResult =>
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
    redirectToSignIn: missingClerkRedirect,
    redirectToSignUp: missingClerkRedirect,
  }) as unknown as AuthResult;

const developmentUser = {
  id: DEVELOPMENT_USER_ID,
  fullName: "Development User",
  firstName: "Development",
  lastName: "User",
  imageUrl: undefined,
  emailAddresses: [{ emailAddress: DEVELOPMENT_EMAIL }],
  privateMetadata: {},
} as unknown as CurrentUserResult;

const developmentMembership = {
  id: "membership_dev",
  publicUserData: {
    userId: DEVELOPMENT_USER_ID,
    identifier: DEVELOPMENT_EMAIL,
    firstName: "Development",
    lastName: "User",
    imageUrl: undefined,
  },
};

const developmentClerkClient = {
  organizations: {
    getOrganizationMembershipList: async () => ({
      data: [developmentMembership],
    }),
  },
  users: {
    getUserList: async () => ({
      data: [developmentUser],
      totalCount: 1,
    }),
  },
} as unknown as ClerkClientResult;

export const auth = (async () =>
  isDevelopmentAuthFallback()
    ? createDevelopmentAuth()
    : clerkAuth()) as typeof clerkAuth;

auth.protect = (async () => {
  const authState = await auth();

  if (!authState.userId) {
    authState.redirectToSignIn();
  }

  return authState as never;
}) as typeof clerkAuth.protect;

export const currentUser = (async (options) =>
  isDevelopmentAuthFallback()
    ? developmentUser
    : clerkCurrentUser(options)) as typeof clerkCurrentUser;

export const clerkClient = (async () =>
  isDevelopmentAuthFallback()
    ? developmentClerkClient
    : createClerkClient()) as typeof createClerkClient;
