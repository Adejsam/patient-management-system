import React from "react";
import { ThemeProvider } from "../../pages/components/theme-provider";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <main>{children}</main>
      </ThemeProvider>
    </div>
  );
};

export default AuthLayout;
