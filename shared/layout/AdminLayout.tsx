import { ThemeProvider } from "../../theme/theme-provider";
import { AdminAppSidebar } from "../../ui/sidebar/admin-sidebar";
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
      <AdminAppSidebar />
      {/* Main content with responsive margin */}
      <SidebarInset
        style={{ marginLeft: sidebarWidth }}
        className="flex-1 flex flex-col min-h-0"
      >
        {/* 
          Ensure main fills all available space.
          Use min-h-0 and flex-1 to allow proper stretching in flexbox layouts.
        */}
        <main className="flex-1 flex flex-col min-h-0 w-full">
          {children}
        </main>
      </SidebarInset>
    </>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div
        suppressHydrationWarning
        className="flex flex-col min-h-screen w-full"
        style={{ minHeight: "100dvh" }} // for mobile browsers supporting dynamic viewport units
      >
        {/* SidebarProvider must directly wrap MainContent */}
        <SidebarProvider defaultOpen={true}>
          {/* 
            This flex container allows sidebar and main content to stretch.
            Use min-h-0 and flex-1 to ensure children can grow to fill the space.
          */}
          <div className="flex flex-1 min-h-0 w-full">
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
        <LandingFooter />
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;