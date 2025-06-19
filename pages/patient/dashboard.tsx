import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Stethoscope, Wallet } from "lucide-react";
import { Card, CardContent } from "../..//ui/card";
import { Button } from "../../ui/button";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import LightfullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../public/assets/icons/logo-full.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { UpcomingAppointments } from "../../ui/components/upcoming_appointments";

export default function PatientDashboard() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const hospitalNumber = localStorage.getItem("hospitalNumber");
  const patientData = JSON.parse(localStorage.getItem("patientInfo") || "{}");
  const firstName = patientData.firstName;
  const lastName = patientData.lastName;
  // Update the profilePic variable to ensure it starts with a leading slash
  const profilePic = patientData.photoUpload;
  const bloogGroup = patientData.bloodGroup;
  const fullName =
    patientData.firstName + " " + patientData?.middleName + " " + patientData.lastName;
  const dateOfBirth = patientData.dateOfBirth;
  const gender = patientData.gender;
  const address =
    patientData.residentialAddress.street +
    " " +
    patientData.residentialAddress.city +
    " " +
    patientData.residentialAddress.state +
    " " +
    patientData.residentialAddress.country;
  const phoneNumebr = patientData.primaryPhoneNumber;
  const marriageStatus = patientData.maritalStatus;

  const logoSrc = resolvedTheme === "dark" ? LightfullLogo : DarkfullLogo;

  return (
    <PatientLayout>
      <Seo title="Dashboard" />
      <Header title="Dashboard" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto pb-10">
        <div className="py-2 px-7 ">
          <h1 className="text-3xl font-bold mt-5 mb-2">Welcome Back 👋 {firstName}</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight">
            Access All Health Information in One Place
          </h2>
        </div>

        {/* Veiw boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10 px-6 md:grid-cols-1">
          <UpcomingAppointments />

          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Stethoscope className="w-10 h-10 text-green-600" />
              <div>
                <h2 className="text-lg font-semibold">Medical Records</h2>
                <p>View your diagnoses and test results</p>
                <Button variant="outline" className="mt-2">
                  <Link href="/patient/view-record">View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Wallet className="w-10 h-10 text-yellow-500" />
              <div>
                <h2 className="text-lg font-semibold">Billing & Payment</h2>
                <p>Manage Payments and Billing Details</p>
                <Button variant="outline" className="mt-2">
                  <Link href="/patient/payment-history">View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center items-center">
          {/* Virtual card component */}
          <div
            className={`shadow-custom rounded-lg p-6 w-full max-w-md m-4 relative overflow-hidden`}>
            <div className="flex justify-between items-center mb-6">
              <Image
                src={logoSrc}
                alt="Hospital Logo"
                width={150}
                height={50}
                priority={true}
                className="object-contain"
              />
              <div className="flex items-center bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Blood Group: <span className="font-bold">{bloogGroup}</span>
                </p>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-[25%] -right-10 w-40 h-40 bg-primary/10 rounded-full"></div>

            {/* Patient Info Section */}
            <div className="flex items-start mb-6 relative z-10">
              <Avatar className="h-24 w-24 rounded-xl shadow-md border-2 border-white dark:border-gray-700">
                <AvatarImage src={profilePic} alt={firstName} className="object-cover" />
                <AvatarFallback>
                  {firstName?.charAt(0)}
                  {lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="ml-5 pt-1">
                <h3 className="font-semibold text-lg mb-2 capitalize">{fullName}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <p className="text-sm">{dateOfBirth}</p>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      {gender.toLowerCase() === "male" ? (
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 0v8m-4-4h8" />
                      ) : (
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 0v3m0 3v2m-4-4h8" />
                      )}
                    </svg>
                    <p className="text-sm">{gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-4"></div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-3 relative z-10">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs  mb-0.5">Residential Address</p>
                  <p className="text-sm">{address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-md mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs  mb-0.5">Contact Number</p>
                  <p className="text-sm ">{phoneNumebr}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs  mb-0.5">Marital Status</p>
                  <p className="text-sm ">{marriageStatus}</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Hospital Number: {hospitalNumber}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Issued: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
