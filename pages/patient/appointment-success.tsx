"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Header from "../components/headers/Header";
import { CalendarIcon } from "lucide-react";

const AppointmentSuccessPage = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { date, time, doctor } = router.query;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={theme === "dark" ? "bg-background text-white" : "bg-background text-black"}>
      <Seo title="Appointment Success" />
      <Header
        title="Appointment Success"
        breadcrumbLinkText="Appointment"
        breadcrumbLinkHref="/patient/book-appointment"
      />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 w-[80%] mx-auto">
        <CheckCircleIcon className="w-16 h-16 text-green-600" />
        <h1 className="my-4 text-2xl font-bold w-[80%] text-center">
          Your <span className="text-primary">Appointment Request</span > has been Successfully Booked!
        </h1>
        <p className="mb-2 text-base text-muted-foreground">We will be in touch shortly</p>
        <br />
        <div className="flex py-4 mt-3 text-base border-t-2 border-b-2 border-t-muted-foreground border-b-muted-foreground text-muted-foreground items-center">
          <p className=" pr-2 text-[16px]">Requested Appointment Details:</p>
          <p className="pr-2 flex items-center">
          <CalendarIcon className="h-5 w-5 pr-1" />Date: {date}
          </p>
          <p className=" pr-2">
            Time: {time}
          </p>
          <p className="">
            Doctor: {doctor}
          </p>
        </div>
        <br />
      </div>
    </div>
  );
};

AppointmentSuccessPage.getLayout = (page: React.ReactElement) => {
  return <PatientLayout>{page}</PatientLayout>;
};

export default AppointmentSuccessPage;
