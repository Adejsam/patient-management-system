"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MedicalRecords from "./medical record/RecordTable";
import AdminLayout from "../../shared/layout/AdminLayout";
import Seo from "../../shared/seo/seo";
import Header from "../components/headers/Header";

const MedicalRecordPage = () => {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo title="Medical Record" />
      <Header
        title="Medical Records"
        breadcrumbLinkText="Home"
        breadcrumbLinkHref="/admin/dashboard"
      />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 sm:h-[100vh] md:h-[100vh] w-[95%] mx-auto">
        <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-5">
          Manage <span className="text-primary"> Medical Record</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-5 tracking-tight ">
          View, Add and Update Patient Medical Record
        </h2>
        <MedicalRecords />
      </div>
    </AdminLayout>
  );
};

export default MedicalRecordPage;
