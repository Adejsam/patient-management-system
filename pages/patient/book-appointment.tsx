import PatientLayout from "../../shared/layout/PatientLayout";
import AppointmentForm from "../components/forms/AppointmentForm";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";

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
      <Header title="Book Appointment" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min w-[97%] mx-auto sm:h-[100vh] md:h-[100vh] mb-5">
        <div className="py-2 px-7">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2">Hello there 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight ">
            Book An Appointment in 20 Seconds
          </h2>
        </div>
        <div>
          <AppointmentForm />
        </div>
      </div>
    </PatientLayout>
  );
}
