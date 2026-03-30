"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { keys } from "./keys";

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  const convexUrl = keys().NEXT_PUBLIC_CONVEX_URL;
  const convex = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [convexUrl]
  );

  if (!convex) {
    return children;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};
