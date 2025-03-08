"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Header from "../components/headers/Header";
import { CalendarIcon, Clock, User, FileText, Phone, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const AppointmentSuccessPage = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { appointmentId, date, time, doctor, patient, reason, contactNumber } = router.query;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBackToHome = () => {
    router.push("/patient/dashboard");
  };

  const formatDate = (dateString: string | string[] | undefined) => {
    if (!dateString) return "";
    try {
      const parsedDate = new Date(dateString.toString());
      return format(parsedDate, "MMMM d, yyyy");
    } catch {
      // Using underscore to indicate intentionally unused error variable
      return dateString.toString();
    }
  };

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

      <div className="flex flex-col items-center justify-center p-4 w-[90%] md:w-[80%] mx-auto">
        <div className="flex flex-col items-center mb-6">
          <CheckCircleIcon className="w-16 h-16 text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-center">
            Your <span className="text-primary">Appointment Request</span> has been Successfully Booked!
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            We will be in touch shortly to confirm your appointment
          </p>
          
          {appointmentId && (
            <p className="mt-2 text-sm font-medium text-primary">
              Appointment ID: #{appointmentId}
            </p>
          )}
        </div>
        
        <Card className="w-full max-w-2xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Appointment Details</h2>
            
            <div className="space-y-4">
              {patient && (
                <div className="flex items-start">
                  <UserCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Patient</p>
                    <p className="text-muted-foreground">{patient}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{formatDate(date)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">{time}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Doctor</p>
                  <p className="text-muted-foreground">{doctor}</p>
                </div>
              </div>
              
              {contactNumber && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Number</p>
                    <p className="text-muted-foreground">{contactNumber}</p>
                  </div>
                </div>
              )}
              
              {reason && (
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Reason for Visit</p>
                    <p className="text-muted-foreground">{reason}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button onClick={handleBackToHome} className="px-6">
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/patient/appointments")}>
            View All Appointments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessPage;

AppointmentSuccessPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PatientLayout>{page}</PatientLayout>;
};