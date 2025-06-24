import { ThemeProvider } from "../../theme/theme-provider";
import { PatientAppSidebar } from "../../ui/sidebar/patient-sidebar";
import LandingFooter from "../../pages/components/footers/LandingFooter";
import { SidebarProvider, SidebarInset } from "../../ui/sidebar";
import React from "react";

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <PatientAppSidebar />
            <SidebarInset className="flex-1 flex flex-col md:ml-64">
              <main className="flex-1 flex flex-col sm:p-4 md:p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <LandingFooter />
      </ThemeProvider>
    </div>
  );
};

export default PatientLayout;
