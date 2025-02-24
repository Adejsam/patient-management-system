import PatientLayout from "../../shared/layout/PatientLayout";
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
import AppointmentForm from "../components/forms/AppointmentForm";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Seo from "../../shared/seo/seo";
import { ModeToggle } from "../components/ui/modeToggle";

export default function Page() {
  useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <PatientLayout>
      <Seo title="Book Appointment"></Seo>
      <header className="flex h-16 shrink-0 items-center justify-between pr-[15px] gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="md:block">
                <BreadcrumbLink href="#">Appointment</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Book Appointment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </header>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min w-[97%] mx-auto">
        <div className="py-2 px-7">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2">Hello there 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight ">
            Book An Appointment in 20 Seconds
          </h2>
        </div>
        <AppointmentForm />
      </div>
    </PatientLayout>
  );
}
