"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Header from "../components/headers/Header";
import { CalendarIcon, Clock, User, FileText, Mail } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";


interface AppointmentDetails {
  appointmentId?: string | string[];
  date?: string | string[];
  time?: string | string[];
  doctor?: string | string[];
  patient?: string | string[];
  reason?: string | string[];
  contactEmail?: string | string[];
  status?: string | string[];
}

const AppointmentSuccessPage = () => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { 
    appointmentId, 
    date, 
    time, 
    doctor, 
    patient, 
    reason, 
    contactEmail,
    status 
  } = router.query as AppointmentDetails;

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
      return dateString.toString();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-background">
      <Seo title="Appointment Success" />
      <Header
        title="Appointment Success"
        breadcrumbLinkText="Appointment"
        breadcrumbLinkHref="/patient/book-appointment"
      />

  <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min w-[97%] mx-auto sm:h-[100vh] md:h-[100vh] mb-5">
      <div className="flex flex-col items-center justify-center p-4 w-[90%] md:w-[100%] mx-auto">
        <div className="flex flex-col items-center mb-6">
          <CheckCircleIcon className="w-16 h-16 text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-center">
            Your <span className="text-primary">Appointment Request</span> has been Successfully Booked!
          </h1>
          <p className="mt-2 text-base text-muted-foreground text-center">
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
            <h2 className="text-2xl font-bold mb-6 md:text-center">Appointment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {patient && (
                <div className="flex items-start">
                  <User className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Patient</p>
                    <p className="text-muted-foreground">{patient}</p>
                  </div>
                </div>
              )}
              
              {doctor && (
                <div className="flex items-start">
                  <User className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Doctor</p>
                    <p className="text-muted-foreground">{doctor}</p>
                  </div>
                </div>
              )}
              
              {date && (
                <div className="flex items-start">
                  <CalendarIcon className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">{formatDate(date)}</p>
                  </div>
                </div>
              )}
              
              {time && (
                <div className="flex items-start">
                  <Clock className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">{time}</p>
                  </div>
                </div>
              )}
              
              {reason && (
                <div className="flex items-start">
                  <FileText className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Reason for Visit</p>
                    <p className="text-muted-foreground">{reason}</p>
                  </div>
                </div>
              )}
              
              {contactEmail && (
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Email</p>
                    <p className="text-muted-foreground">{contactEmail}</p>
                  </div>
                </div>
              )}
              
              {status && (
                <div className="flex items-start">
                  <Clock className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">{status}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex flex-col gap-4">
          <Button onClick={handleBackToHome} className="px-6">
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/patient/appointments")}>
            View All Appointments
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessPage;

AppointmentSuccessPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PatientLayout>{page}</PatientLayout>;
};