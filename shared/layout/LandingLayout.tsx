import LandingFooter from "../../pages/components/footers/LandingFooter";
import LandingHeader from "../../pages/components/headers/landingHeader";
import { ThemeProvider } from "../../theme/theme-provider";
import React from "react";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LandingHeader />
        <main>{children}</main>
        <LandingFooter />
      </ThemeProvider>
    </div>
  );
};

export default LandingLayout;
