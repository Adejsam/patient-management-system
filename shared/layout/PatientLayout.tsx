import { ThemeProvider } from "../../pages/components/theme-provider";
import { PatientAppSidebar } from "../../pages/components/patient-sidebar";
import LandingFooter from "../../pages/components/footers/LandingFooter";
import { SidebarProvider, SidebarInset } from "../../pages/components/ui/sidebar";
import React from "react";

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <PatientAppSidebar />
          <SidebarInset>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <LandingFooter />
      </ThemeProvider>
    </div>
  );
};

export default PatientLayout;
