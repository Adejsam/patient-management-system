"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../../pages/components/headers/Header";
import { Card, CardHeader, CardTitle, CardContent } from "../../pages/components/ui/card";

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
  const [patientName, setPatientName] = useState("");
  // const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Only access localStorage on the client side
    const patientData = JSON.parse(localStorage.getItem("patientInfo") || "{}");
    setPatientName(patientData.firstName || "");
    // fetchAppointments();
  }, []);


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
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto">
      <div className="container mx-auto p-4">
      <h1 className="text-3xl/9 font-bold my-2">Hello {patientName} 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight mb-4">
            View Your <span className="text-primary">Appointment History</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>23/02/2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Time: 11:00 am</p>
                  <p>Doctor: Doctor Akpan</p>
                  <p>Field: Dentist</p>
                  <p>Contact: 08021815090</p>
                  <p >Status: success</p>
                  <p>Reason for visit: Medical Consultation</p>
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