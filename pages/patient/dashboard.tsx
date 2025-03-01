import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Stethoscope, Wallet } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import LightfullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../public/assets/icons/logo-full.svg";

export default function PatientDashboard() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === "dark" ? LightfullLogo : DarkfullLogo;

  return (
    <PatientLayout>
      <Seo title="Dashboard" />
      <Header title="Dashboard" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto pb-10">
        <div className="py-2 px-7 ">
          <h1 className="text-3xl font-bold mt-5 mb-2">Welcome Back 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight">
            Access All Health Information in One Place
          </h2>
        </div>

        {/* Veiw boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10 px-6 md:grid-cols-1">
          <Card className="md:w-full">
            <CardContent className="flex items-center space-x-4 p-4">
              <Calendar className="w-10 h-10 text-blue-500" />
              <div>
                <h2 className="text-lg font-semibold">Upcoming Appointment</h2>
                <p>09/03/2025 at 11 am</p>
                <p className="text-sm text-gray-500">Doctor James</p>
              </div>
            </CardContent>
          </Card>

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
          <div className={`shadow-custom rounded-lg p-6 w-full max-w-md m-4`}>
            <div className="flex justify-between items-center mb-4">
              <Image src={logoSrc} alt="Hospital Logo" width={150} height={150} priority={true} />
              <div className="text-right">
                <p className="text-sm">Blood Group: O+</p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <Image
                src="/path/to/profile-picture.jpg"
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm pb-2">Patient Name: John Doe</p>
                <p className="text-sm pb-2">Date of Birth: 01/01/1990</p>
                <p className="text-sm">Gender: Male</p>
              </div>
            </div>
            <p className="text-sm mb-2">Address: 123 Main St, City, Country</p>
            <p className="text-sm mb-2">Contact Number: 123-456-7890</p>
            <p className="text-sm">Marriage Status: Married</p>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
