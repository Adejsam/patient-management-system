"use client";

import * as React from "react";
import {
  BookOpen,
  CalendarDays,
  ReceiptText,
  LayoutDashboard,
  User,
  MessageSquareMore,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "./ui/sidebar";
import LightfullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../public/assets/icons/logo-full.svg";
import { useEffect, useState } from "react";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "Appointments",
      url: "#",
      icon: CalendarDays,
      items: [
        {
          title: "Manage Appoointment",
          url: "/admin/appointment",
        },
      ],
    },
    {
      title: "Medical Records",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "View Records",
          url: "/admin/view-medical-record",
        },
        {
          title: "Add Records",
          url: "/admin/add-medical-record",
        },
      ],
    },
    {
      title: "Bills & Payments",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "View Transaction",
          url: "/admin/view-invoice-reciept",
        },
        {
          title: "Create Payment",
          url: "/admin/add-invoice-reciept",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: User,
      items: [
        {
          title: "Manage Patient",
          url: "/admin/manage-patient",
        },
        {
          title: "Manage Staff",
          url: "/admin/manage-staff",
        },
        {
          title: "Add Staff",
          url: "/admin/add-staff",
        }
      ],
    },
    {
      title: "Support & Feedback",
      url: "#",
      icon: MessageSquareMore,
      items: [
        {
          title: "Patient Queries",
          url: "/admin/patient-queries",
        },
      ],
    },
  ],
};

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === "dark" ? DarkfullLogo : LightfullLogo;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/admin/dashboard"><Image src={logoSrc} alt="logo" width={150} height={150} className="pt-2" /></Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
