"use client";

import * as React from "react";
import { BookOpen, CalendarDays, ReceiptText, LayoutDashboard, MessageCircleQuestion } from "lucide-react";
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
      url: "/patient/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/patient/dashboard",
        },
      ],
    },
    {
      title: "Appointments",
      url: "#",
      icon: CalendarDays,
      items: [
        {
          title: "Book Appoointment",
          url: "/patient/book-appointment",
        },
        {
          title: "Appointment History",
          url: "/patient/appointment-history",
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
          url: "#",
        },
        {
          title: "Doctor Notes",
          url: "#",
        },
      ],
    },
    {
      title: "Bills & Payments",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "View Bills",
          url: "#",
        },
        {
          title: "Payment History",
          url: "#",
        },
      ],
    },
    {
      title: "Help & Support",
      url: "#",
      icon: MessageCircleQuestion,
      items: [
        {
          title: "Lodge Complaint",
          url: "#",
        },
        {
          title: "Complaint History",
          url: "#",
        },
      ],
    },
  ],
};

export function PatientAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <Link href="/patient/dashboard"><Image src={logoSrc} alt="logo" width={150} height={150} className="pt-2" /></Link>
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
