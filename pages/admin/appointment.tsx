"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Appointments from "./appointment/AppointmentTable";
import AdminLayout from "../../shared/layout/AdminLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import { SidebarTrigger } from "../components/ui/sidebar";
import { ModeToggle } from "../components/ui/modeToggle";
import Seo from "../../shared/seo/seo";

const AppointmentPage = () => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Seo title="Appointments"></Seo>
      <header className="flex h-16 shrink-0 items-center justify-between pr-[15px] gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="md:block">
                <BreadcrumbLink href="#">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Appointments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-fit flex-1 rounded-xl bg-muted/50 ">
          <Appointments />
        </div>
      </div>
    </div>
  );
};

AppointmentPage.getLayout = (page: React.ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AppointmentPage;
