import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumb";
import { Separator } from "../../components/ui/separator";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { ModeToggle } from "../../components/ui/modeToggle";

interface HeaderProps {
  title: string;
  breadcrumbLinkText: string;
  breadcrumbLinkHref: string;
}

const Header: React.FC<HeaderProps> = ({ title, breadcrumbLinkText, breadcrumbLinkHref }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between pr-[15px] gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="md:block">
              <BreadcrumbLink href={breadcrumbLinkHref}>{breadcrumbLinkText}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ModeToggle />
    </header>
  );
};

export default Header;