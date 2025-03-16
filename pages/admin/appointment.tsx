"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Appointments from "./appointment/AppointmentTable";
import AdminLayout from "../../shared/layout/AdminLayout";
import Seo from "../../shared/seo/seo";
import Header from "../../pages/components/headers/Header";

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
      <Seo title="Appointments" />
      <Header title="Appointments" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto ">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-4">Manage <span className="text-primary"> Appointment</span></h1>
          <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight ">
            View, Cancel, Approve, reject or Reschedule Appoinments
          </h2>
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
