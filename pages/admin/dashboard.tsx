"use client";

import React, { JSX } from "react";
import AdminLayout from "../../shared/layout/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Seo from "../../shared/seo/seo";
import { User, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "../components/headers/Header";
import { Button } from "../components/ui/button";
import { FileText, Calendar, ClipboardList, Activity } from "lucide-react";

export default function Page() {
  useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch total patients
      const patientsResponse = await fetch("http://localhost/hospital_api/total_patients.php");
      if (!patientsResponse.ok) throw new Error("Failed to fetch patients");
      const patientsData = await patientsResponse.json();
      setTotalPatients(patientsData.total_patients);

      // Fetch total staff
      const staffResponse = await fetch("http://localhost/hospital_api/total_staffs.php");
      if (!staffResponse.ok) throw new Error("Failed to fetch staff");
      const staffData = await staffResponse.json();
      setTotalStaff(staffData.total_staff);

      // Fetch total revenue
      const revenueResponse = await fetch("http://localhost/hospital_api/total_revenue.php");
      if (!revenueResponse.ok) throw new Error("Failed to fetch revenue");
      const revenueData = await revenueResponse.json();
      setTotalRevenue(revenueData.total_revenue);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo title="Dashboard" />
      <Header title="Dashboard" breadcrumbLinkText="Home" breadcrumbLinkHref="/admin/dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:h-[100vh]">
          <h1 className="text-3xl font-bold pt-7 pl-5 pb-1">
            Staff <span className="text-primary">Dashboard</span>
          </h1>
          <h3 className="text-base pl-5 pb-7">Manage Your Patient Effectively</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Wallet className="h-7 w-7 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{totalRevenue}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total staff</CardTitle>
                <Users className="h-7 w-7 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStaff}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patient</CardTitle>
                <User className="h-7 w-7 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPatients}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-5 pb-10 mx-auto">
            <DashboardCard
              title="Patients"
              icon={<User size={32} />}
              link="/admin/manage-patient"
            />
            <DashboardCard
              title="Invoices & Receipts"
              icon={<FileText size={32} />}
              link="/admin/view-invoice-reciept"
            />
            <DashboardCard
              title="Appointments"
              icon={<Calendar size={32} />}
              link="/admin/appointment"
            />
            <DashboardCard
              title="Medical Records"
              icon={<ClipboardList size={32} />}
              link="/admin/view-medical-record"
            />
            <DashboardCard
              title="Customer Complaints"
              icon={<Activity size={32} />}
              link="/admin/patient-queries"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function DashboardCard({ title, icon, link }: { title: string; icon: JSX.Element; link: string }) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center space-y-4 shadow-lg rounded-lg">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button asChild>
        <a href={link}>Manage</a>
      </Button>
    </Card>
  );
}