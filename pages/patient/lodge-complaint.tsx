"use client";
import { useEffect, useState } from "react";
import PatientLayout from "../../shared/layout/PatientLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";
import LodgeComplaintForm from "../components/forms/complaintForm";
import { useTheme } from "next-themes";

export default function LodgeComplaintPage() {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <PatientLayout>
      <Seo title="Lodge a Complaint" />
      <Header title="Lodge a Complaint" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50  w-[97%] mx-auto sm:h-[100vh] md:h-[100vh] mb-5">
        <h1 className="text-3xl font-bold pt-7 mb-2 pl-6">
          Lodge a <span className="text-primary">Complaint</span>
        </h1>
        <h2 className="text-lg text-muted-foreground pl-6 tracking-tight">
          We value your feedback and take all complaints seriously
        </h2>

        <div className="m-4 p-4 ">
          <LodgeComplaintForm />
        </div>
      </div>
    </PatientLayout>
  );
}
