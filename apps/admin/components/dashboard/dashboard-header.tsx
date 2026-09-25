"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@onlystartups/ui";
import { useSidebar, useBreadcrumbContext } from "@onlystartups/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@onlystartups/ui";
import { Separator } from "@onlystartups/ui";

export function DashboardHeader() {
  const pathname = usePathname();
  const { toggleMinimized, isMinimized } = useSidebar();
  const { breadcrumbMap } = useBreadcrumbContext();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  return (
    <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center gap-4 border-b border-border/40 bg-white/90 px-3 md:px-4 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMinimized}
        className="hidden lg:flex text-muted-foreground hover:text-[#F26522] hover:bg-[#F26522]/5 rounded-full h-9 w-9"
      >
        {isMinimized ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      
      <Separator orientation="vertical" className="hidden h-4 lg:block" />

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            
            // Use context mapping if available, otherwise fallback to titlecase
            let label = breadcrumbMap[segment.toLowerCase()];
            if (!label) {
               label = (segment === "overview" || segment === "dashboard") ? "Dashboard" : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
            }

            return (
              <React.Fragment key={href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-xs">{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href} className="text-xs font-medium">{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>


    </header>
  );
}
