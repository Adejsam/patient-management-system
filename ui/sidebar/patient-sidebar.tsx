import * as React from "react";
import {
  BookOpen,
  CalendarDays,
  ReceiptText,
  LayoutDashboard,
  MessageCircleQuestion,
  BriefcaseMedical,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../sidebar";
import Image from "next/image";
import LightfullLogo from "../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../public/assets/icons/logo-full.svg";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  user: {
    name: "carepulse",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/patient/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Doctors",
      url: "#",
      icon: BriefcaseMedical,
      items: [
        {
          title: "View Doctors",
          url: "/patient/view-doctors",
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
          url: "/patient/view-record",
        },
      ],
    },
    {
      title: "Bills & Payments",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "Payment History",
          url: "/patient/payment-history",
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
          url: "/patient/lodge-complaint",
        },
        {
          title: "Complaint History",
          url: "/patient/complaint-history",
        },
      ],
    },
  ],
};

export function PatientAppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the sidebar content, only delay the logo
  const logoSrc = resolvedTheme === "dark" ? DarkfullLogo : LightfullLogo;

  return (
    <Sidebar collapsible="offcanvas" className="bg-background"  {...props}>
      <SidebarHeader>
        <Link href="/patient/dashboard">
          {/* Only delay the logo until mounted to avoid hydration mismatch */}
          <Image
            src={mounted ? logoSrc : LightfullLogo}
            alt="logo"
            width={150}
            height={150}
            className="pt-2"
            priority
          />
        </Link>
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