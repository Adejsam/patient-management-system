"use client";

import {
  // Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../sidebar";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import React from "react";

export function NavUser({}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  const [userData, setUserData] = useState({
    patientData: {},
    firstName: "",
    profilePic: "",
    email: "",
    userData: {},
    userFisrtName: "",
    userEmail: "",
    userProfilePic: "",
  });

  useEffect(() => {
    const fetchUserData = () => {
      const patientData = JSON.parse(localStorage.getItem("patientInfo") || "{}");
      const firstName = patientData.firstName || "";
      const profilePic = patientData.photoUpload || "";
      const email = localStorage.getItem("email") || "";
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userFisrtName = userData.first_name || "";
      const userEmail = userData.email || "";
      const userProfilePic = userData.profile_picture || "";

      setUserData({
        patientData,
        firstName,
        profilePic,
        email,
        userData,
        userFisrtName,
        userEmail,
        userProfilePic,
      });
    };

    fetchUserData();
  }, []);

  const logout = () => {
    // Clear localStorage
    const keysToRemove = [
      "user",
      "userRole",
      "patientInfo",
      "userData",
      "email",
      "role",
      "user_id",
      "hospitalNumber",
      "patient",
      "message",
      "success",
      "patientData",
      "patientId",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log(localStorage);

    // Clear cookies
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    // Redirect to home page
    window.location.href = "/";
  };

  useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.profilePic} alt={userData.firstName} />
                <AvatarImage src={userData.userProfilePic} alt={userData.userFisrtName} />
                <AvatarFallback className="rounded-lg">CP</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-[16px] leading-tight">
                <span className="truncate">
                  {userData.firstName} {userData.userFisrtName}
                </span>
                <span className="truncate text-[16px]">
                  {userData.email} {userData.userEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-3"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.profilePic} alt={userData.firstName} />
                  <AvatarFallback className="rounded-lg">CP</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-[16px] leading-tight">
                  <span className="truncate">
                    {userData.firstName} {userData.userFisrtName}
                  </span>
                  <span className="truncate text-[16px]">
                    {userData.email} {userData.userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
