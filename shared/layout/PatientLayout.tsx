import { ThemeProvider } from "../../theme/theme-provider";
import { PatientAppSidebar } from "../../ui/sidebar/patient-sidebar";
import LandingFooter from "../../pages/components/footers/LandingFooter";
import { SidebarProvider, SidebarInset, useSidebar } from "../../ui/sidebar";
import React from "react";

// MainContent must be a direct child of SidebarProvider for useSidebar to work
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { state, isMobile } = useSidebar();
  // Only shift content on desktop when sidebar is expanded
  const sidebarWidth = !isMobile && state === "expanded" ? "16rem" : "0";
  return (
    <>
      {/* Sidebar must NOT be wrapped in any extra divs */}
      <PatientAppSidebar />
      {/* Main content with responsive margin */}
      <SidebarInset style={{ marginLeft: sidebarWidth }}>
        <main>{children}</main>
      </SidebarInset>
    </>
  );
};

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* SidebarProvider must directly wrap MainContent */}
        <SidebarProvider defaultOpen={true}>
          <MainContent>{children}</MainContent>
        </SidebarProvider>
        <LandingFooter />
      </ThemeProvider>
    </div>
  );
};

export default PatientLayout;
