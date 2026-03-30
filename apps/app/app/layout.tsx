import { env } from "@/env";
import "./styles.css";
import { AnalyticsProvider } from "@platform/analytics/provider";
import { ConvexClientProvider } from "@platform/backend";
import { DesignSystemProvider } from "@platform/design-system";
import { fonts } from "@platform/design-system/lib/fonts";
import { Toolbar } from "@platform/feature-flags/components/toolbar";
import type { ReactNode } from "react";

interface RootLayoutProperties {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ConvexClientProvider>
        <AnalyticsProvider>
          <DesignSystemProvider
            helpUrl={env.NEXT_PUBLIC_DOCS_URL}
            privacyUrl={new URL(
              "/legal/privacy",
              env.NEXT_PUBLIC_WEB_URL
            ).toString()}
            termsUrl={new URL(
              "/legal/terms",
              env.NEXT_PUBLIC_WEB_URL
            ).toString()}
          >
            {children}
          </DesignSystemProvider>
        </AnalyticsProvider>
      </ConvexClientProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
