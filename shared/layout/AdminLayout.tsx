import { ThemeProvider } from "../../theme/theme-provider";
import { AdminAppSidebar } from "../../ui/sidebar/admin-sidebar";
import { SidebarProvider, SidebarInset } from "../../ui/sidebar";
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
