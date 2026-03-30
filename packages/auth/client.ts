import {
  OrganizationSwitcher as ClerkOrganizationSwitcher,
  UserButton as ClerkUserButton,
} from "@clerk/nextjs";
import type { ComponentProps } from "react";
import { createElement } from "react";
import {
  DEVELOPMENT_EMAIL,
  isClerkConfigured,
  isDevelopmentAuthFallback,
} from "./config";

const placeholderClassName =
  "flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted-foreground";

export const OrganizationSwitcher = (
  properties: ComponentProps<typeof ClerkOrganizationSwitcher>
): ReturnType<typeof createElement> => {
  if (isClerkConfigured()) {
    return createElement(ClerkOrganizationSwitcher, properties);
  }

  return createElement(
    "div",
    { className: placeholderClassName },
    isDevelopmentAuthFallback() ? "Development Workspace" : "Authentication"
  );
};

export const UserButton = (
  properties: ComponentProps<typeof ClerkUserButton>
): ReturnType<typeof createElement> => {
  if (isClerkConfigured()) {
    return createElement(ClerkUserButton, properties);
  }

  return createElement(
    "div",
    { className: `${placeholderClassName} max-w-full truncate` },
    isDevelopmentAuthFallback() ? DEVELOPMENT_EMAIL : "Auth not configured"
  );
};
