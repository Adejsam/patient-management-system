"use client"

import {
  // Bell,
  UserRound,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar"
import Link from "next/link"

export function NavUser({
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()


  const patientData = JSON.parse(localStorage.getItem('patientInfo') || '{}');
const firstName = patientData.firstName;
const profilePic = patientData.photoUpload;
const email = localStorage.getItem('email');
const userData = JSON.parse(localStorage.getItem('userData') || '{}');
const userFisrtName = userData.first_name;
const userEmail = userData.email;
const userProfilePic = userData.profile_picture


const logout = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('patientInfo');
  localStorage.removeItem('userData')
  localStorage.removeItem('email');
  localStorage.removeItem('role')
  localStorage.removeItem('user_id')
  localStorage.removeItem('hospitalNumber')
  localStorage.removeItem('patient')
  localStorage.removeItem('message');
  localStorage.removeItem('success')
  localStorage.removeItem('patientData')


  // Clear cookies
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

  // Redirect to home page
  window.location.href = '/';
};

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profilePic} alt={firstName} />
                <AvatarImage src={userProfilePic} alt={userFisrtName} />
                <AvatarFallback className="rounded-lg">CP</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{firstName} {userFisrtName}</span>
                <span className="truncate text-xs">{email} {userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profilePic} alt={firstName} />
                  <AvatarFallback className="rounded-lg">CP</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{firstName} {userFisrtName}</span>
                  <span className="truncate text-xs">{email} {userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRound />
                <Link href="/patient/manage-profile">Manage Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button onClick={logout} className="inline-flex items-center gap-[5px]">
                <LogOut />
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
