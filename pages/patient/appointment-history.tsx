"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import { Loader2, AlertCircle, User, Calendar, FileText, Mail } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import Link from "next/link";

interface Appointment {
  appointment_id: string;
  appointment_datetime: string;
  reason_for_visit: string;
  contact_email: string;
  status: string;
  patient_name: string;
  patient_contact: string;
  doctor_name: string;
  doctor_specialization: string;
}

const AppointmentHistoryPage = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const patientId = localStorage.getItem("patientId");
    const patientData = JSON.parse(localStorage.getItem("patientInfo") || "{}");
    // Convert patientId to number if it's a valid string
    const numericPatientId = patientId ? parseInt(patientId, 10) : null;

    setPatientName(numericPatientId ? patientData.first_name : "");
    console.log(localStorage);
    if (numericPatientId) {
      fetchAppointments(numericPatientId);
    }
  }, []);

  const fetchAppointments = async (patientId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost/hospital_api/get_patient_appointment.php?patient_id=${patientId}`
      );
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments);
        setError("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={theme === "dark" ? "bg-background text-white" : "bg-background text-black"}>
      <Seo title="Appointment History" />
      <Header title="Appointment History" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto">
        <div className="container mx-auto p-4">
          <div className="flex flex-col mb-8">
            <h1 className="text-4xl/10 font-bold pt-4">Hello {patientName} 👋</h1>
            <h2 className="text-lg placeholder-opacity-80 tracking-tight">
              View Your <span className="text-primary">Appointment History</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
              <Button variant="ghost" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No appointments found</p>
                <Button variant="outline">
                  <Link href="/patient/book-appointment">Book New Appointment</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                // Parse datetime and split into date and time
                const appointmentDateTime = new Date(appointment.appointment_datetime);
                const formattedDate = appointmentDateTime.toLocaleDateString();
                const formattedTime = appointmentDateTime.toLocaleTimeString();

                return (
                  <div
                    key={appointment.appointment_id}
                    className="bg-card rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{formattedDate}</h3>
                        <p className="text-sm text-muted-foreground">{formattedTime}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-sm ${
                          appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Dr. {appointment.doctor_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor_specialization}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Reason for Visit</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.reason_for_visit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Contact</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.patient_contact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AppointmentHistoryPage.getLayout = (page: React.ReactElement) => {
  return <PatientLayout>{page}</PatientLayout>;
};

export default AppointmentHistoryPage;
