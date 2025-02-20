import { ThemeProvider } from "../../pages/components/theme-provider";
import { AppSidebar } from "../../pages/components/app-sidebar";
import React from "react";

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AppSidebar />
        <main>{children}</main>
      </ThemeProvider>
    </div>
  );
};

export default PatientLayout;
