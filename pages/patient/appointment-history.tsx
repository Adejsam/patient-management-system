"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../../pages/components/headers/Header";
import { Card, CardHeader, CardTitle, CardContent } from "../../pages/components/ui/card";
import { Button } from "../components/ui/button";

// type Appointment = {
//   id: number;
//   date: string;
//   time: string;
//   doctorName: string;
//   status: string;
//   doctorField: string;
//   doctorContact: string;
// };

const AppointmentHistoryPage = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // fetchAppointments();
  }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch("/api/appointments");
//       const data = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error("Error fetching appointment history:", error);
//     }
//   };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={theme === "dark" ? "bg-background text-white" : "bg-background text-black"}>
      <Seo title="Appointment History" />
      <Header title="Appointment History" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min w-[97%] mx-auto">
      <div className="container mx-auto p-4">
      <h1 className="text-3xl/9 font-bold my-2">Hello there 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight mb-4">
            View Your Appointment History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>23/02/2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Time: 11:00 am</p>
                  <p>Doctor: Doctor Akpan</p>
                  <p>Field: Dentist</p>
                  <p>Contact: 08021815090</p>
                  <p >Status: success</p>
                  <div className="dislay-flex flex-col">
                    <Button variant={"destructive"} className="mx-auto mt-4 ">Cancel Appointment</Button>
                    <Button variant={"secondary"} className="mx-auto mt-4">Reschedule Appointment</Button>
                  </div>
                </CardContent>
              </Card>
          </div>
      </div>
      </div>
    </div>
  );
};

AppointmentHistoryPage.getLayout = (page: React.ReactElement) => {
  return <PatientLayout>{page}</PatientLayout>;
};

export default AppointmentHistoryPage;