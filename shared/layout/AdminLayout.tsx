import { ThemeProvider } from "../../pages/components/theme-provider";
import { AdminAppSidebar } from "../../pages/components/admin-sidebar";
import { SidebarProvider, SidebarInset } from "../../pages/components/ui/sidebar";
import React from "react";
import LandingFooter from "../../pages/components/footers/LandingFooter";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <AdminAppSidebar />
          <SidebarInset>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <LandingFooter />
      </ThemeProvider>
    </div>
  );
};

export default AdminLayout;
