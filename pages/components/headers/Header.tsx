import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../ui/breadcrumb";
import { Separator } from "../../../ui/separator";
import { ModeToggle } from "../../../ui/modeToggle";
import { SidebarTrigger } from "../../../ui/sidebar";

interface HeaderProps {
  title: string;
  breadcrumbLinkText: string;
  breadcrumbLinkHref: string;
}

const Header: React.FC<HeaderProps> = ({ title, breadcrumbLinkText, breadcrumbLinkHref }) => {
  return (
    <header className="flex h-16 w-full shrink-0 items-center bg-background pr-4 justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger className="z-50" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="md:block">
              <BreadcrumbLink className="sm:hidden" href={breadcrumbLinkHref}>
                {breadcrumbLinkText}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pr-3">
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
