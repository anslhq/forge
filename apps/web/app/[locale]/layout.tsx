import "./styles.css";
import { AnalyticsProvider } from "@platform/analytics/provider";
import { DesignSystemProvider } from "@platform/design-system";
import { fonts } from "@platform/design-system/lib/fonts";
import { cn } from "@platform/design-system/lib/utils";
import { Toolbar } from "@platform/feature-flags/components/toolbar";
import { getDictionary } from "@platform/internationalization";
import type { ReactNode } from "react";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <Header dictionary={dictionary} />
            {children}
            <Footer />
          </DesignSystemProvider>
          <Toolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
