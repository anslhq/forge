import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cn } from "@platform/design-system/lib/utils";

export const fonts = cn(
  "touch-manipulation antialiased font-mono",
  GeistSans.variable,
  GeistMono.variable
);
