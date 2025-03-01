"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MedicalRecords from "./medical record/RecordTable";
import AdminLayout from "../../shared/layout/AdminLayout";
import Seo from "../../shared/seo/seo";
import Header from "../../pages/components/headers/Header";

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
    <div>
      <Seo title="Medical Record" />
      <Header title="Medical Records" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-fit flex-1 rounded-xl bg-muted/50 ">
          <h1 className="text-3xl/9 font-bold mt-5 mb-2 pl-4">
            Manage <span className="text-primary"> Medical Record</span>
          </h1>
          <h2 className="text-lg placeholder-opacity-80 pl-4 tracking-tight ">
            View, Add and Update Patient Medical Record
          </h2>
          <MedicalRecords />
        </div>
      </div>
    </div>
  );
};

MedicalRecordPage.getLayout = (page: React.ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default MedicalRecordPage;
