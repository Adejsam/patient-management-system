"use client";

import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import Image from "next/image";
import LightFullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkFullLogo from "../../public/assets/icons/logo-full.svg";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Page() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === "dark" ? DarkFullLogo : LightFullLogo;

  return (
    <PatientLayout>
      <Seo title="Dashboard" />
      <Header title="Dashboard" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex justify-center items-center relative w-[97%] mx-auto">
        <div className="py-2 px-7 top-0 left-0 absolute">
          <h1 className="text-3xl font-bold mt-5 mb-2">Welcome Back 👋</h1>
          <h2 className="text-lg placeholder-opacity-80 tracking-tight">
            Access All Health Information in One Place
          </h2>
        </div>

        {/* Virtual card component */}
        <div className={`shadow-custom rounded-lg p-6 w-full max-w-md`}>
          <div className="flex justify-between items-center mb-4">
            <Image src={logoSrc} alt="Hospital Logo" width={150} height={150} />
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
    </PatientLayout>
  );
}