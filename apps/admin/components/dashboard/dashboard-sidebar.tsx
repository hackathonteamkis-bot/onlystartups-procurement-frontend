"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  LayoutDashboard,
  UsersRound,
  Calendar,
  Layers,
  LogOut,
  User,
  Shield,
  Users2,
  Compass,
  ChevronDown,
  Bell,
  Zap,
  Newspaper,
  Menu,
  Rocket,
  Users,
  X,
  Plug,
  School,
  Globe,
  ArrowLeft,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/logout-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@onlystartups/ui";
import { getGovDepartmentData } from "@/actions/gov-department";

// Types
interface NavItem {
  name: string;
  href: string;
  icon: any;
  items?: { name: string; href: string }[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// Sub-component: NavItem - Memoized for performance
const NavItem = memo(({ 
  item, 
  minimized, 
  pathname, 
  isOpen, 
  onToggle 
}: { 
  item: NavItem; 
  minimized: boolean; 
  pathname: string;
  isOpen: boolean;
  onToggle: (name: string) => void;
}) => {
  const [tooltipPos, setTooltipPos] = useState<{top: number, left: number} | null>(null);
  const hasSubItems = item.items && item.items.length > 0;
  const isActive = pathname === item.href || (hasSubItems && item.items!.some(sub => pathname === sub.href));

  return (
    <div className="space-y-1">
      <div
        onClick={() => hasSubItems && !minimized && onToggle(item.name)}
        className={cn(
          "group relative flex items-center transition-all duration-200 cursor-pointer",
          minimized
            ? "justify-center h-10 w-10 mx-auto rounded-lg"
            : "px-3 py-2 rounded-lg space-x-3",
          isActive && (!hasSubItems || minimized)
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {minimized ? (
          <Link 
            href={item.href} 
            className="flex items-center justify-center w-full h-full relative"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 12 });
            }}
            onMouseLeave={() => setTooltipPos(null)}
          >
            <item.icon className={cn("w-5 h-5", isActive && "text-[#F26522]")} />
            {tooltipPos && typeof document !== 'undefined' && createPortal(
              <div 
                className="fixed z-[9999] px-3 py-1.5 bg-[#1A1A2E] text-white text-xs font-semibold rounded-md border border-white/10 shadow-xl transform -translate-y-1/2 pointer-events-none"
                style={{ top: tooltipPos.top, left: tooltipPos.left }}
              >
                {item.name}
              </div>,
              document.body
            )}
          </Link>
        ) : (
          <>
            <Link href={item.href} className="flex flex-1 items-center space-x-3">
              <item.icon className={cn("w-4 h-4", isActive && "text-[#F26522]")} />
              <span className="text-sm font-medium tracking-tight">{item.name}</span>
            </Link>
            {hasSubItems && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200 opacity-50",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </>
        )}

        {/* Tooltip removed to prevent horizontal overflow bugs */}
      </div>

      <AnimatePresence>
        {hasSubItems && isOpen && !minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-white/20 ml-5 pl-2 space-y-1"
          >
            {item.items!.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  "block px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  pathname === subItem.href
                    ? "text-[#F26522] bg-[#F26522]/5"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                {subItem.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
NavItem.displayName = "NavItem";

// Sub-component: SidebarContent - Memoized
interface SidebarSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    startupName?: string | null;
  } | null;
}

const SidebarContent = memo(({ 
  minimized, 
  navGroups, 
  pathname, 
  openItems, 
  onToggle,
  session,
  isPublicView,
  setIsPublicView,
  userRole
}: {
  minimized: boolean;
  navGroups: NavGroup[];
  pathname: string;
  openItems: string[];
  onToggle: (name: string) => void;
  session: SidebarSession | null;
  isPublicView: boolean;
  setIsPublicView: (v: boolean) => void;
  userRole: string;
}) => (
  <div
    className={cn(
      "flex flex-col h-full bg-sidebar transition-all duration-300 relative overflow-x-hidden",
      minimized ? "w-20" : "w-full"
    )}
  >
    {isPublicView ? (
      <div className={cn("pt-6 pb-4 px-6 flex flex-col gap-6", minimized && "px-4 items-center")}>
        <button onClick={() => setIsPublicView(false)} className={cn(
          "flex items-center justify-center bg-black text-white rounded-md hover:bg-black/80 transition-colors shadow-sm",
          minimized ? "w-10 h-10" : "px-4 py-2 w-fit gap-2"
        )}>
          <ArrowLeft className="w-4 h-4" />
          {!minimized && <span className="text-sm font-medium">Go Back</span>}
        </button>
        
        {!minimized && (
          <h2 className="text-2xl font-semibold text-sidebar-foreground">
            Public Menus
          </h2>
        )}
      </div>
    ) : (
      <div className={cn("pt-6 pb-2 px-6 flex items-center", minimized && "justify-center px-4")}>
        <Link href="/" className="flex items-center group gap-2">
          <Image
            src="/logo/os-logo-white.svg"
            alt="OnlyStartups Logo"
            width={32}
            height={32}
            className="w-8 h-8 transition-transform group-hover:scale-110 shrink-0"
          />
          {!minimized && (
            <Image
              src="/logo/os-fulltext-white.png"
              alt="OnlyStartups Text Logo"
              width={140}
              height={40}
              className="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
          )}
        </Link>
      </div>
    )}

    <nav className={cn(
      "flex-1 px-3 pt-2 pb-6 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      minimized ? "space-y-2" : "space-y-5"
    )}>
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-2">
          {!minimized && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/60">
              {group.label}
            </p>
          )}
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavItem 
                key={item.name} 
                item={item} 
                minimized={minimized} 
                pathname={pathname}
                isOpen={openItems.includes(item.name)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      ))}
      
      {!isPublicView && (
        <div className="mt-6">
          <div
            onClick={() => setIsPublicView(true)}
            className={cn(
              "group relative flex items-center transition-all duration-200 cursor-pointer",
              minimized
                ? "justify-center h-10 w-10 mx-auto rounded-lg"
                : "px-3 py-2 rounded-lg space-x-3",
              "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Globe className={cn("w-5 h-5", minimized ? "w-5 h-5" : "w-4 h-4")} />
            {!minimized && <span className="text-sm font-medium tracking-tight">Public Menus</span>}
          </div>
        </div>
      )}
    </nav>

    <div className={cn("p-4 border-t border-sidebar-border", minimized && "px-0")}>
      <div
        className={cn(
          "flex items-center rounded-xl",
          minimized ? "flex-col gap-4 py-2" : "p-2 bg-sidebar-accent/30 space-x-3 justify-between"
        )}
      >
        <div className={cn("flex items-center overflow-hidden", !minimized && "space-x-3 flex-1")}>
          <Avatar className={cn("h-8 w-8 shrink-0 border border-sidebar-border", minimized && "h-10 w-10")}>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-bold">
              {`${(session?.user as any)?.firstName || ''} ${(session?.user as any)?.lastName || ''}`.trim()?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {!minimized && (
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-bold text-sidebar-foreground truncate">
                {`${(session?.user as any)?.firstName || ''} ${(session?.user as any)?.lastName || ''}`.trim() || "User"}
              </p>
              <p className="text-[10px] font-medium text-sidebar-foreground/70 truncate">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
        
        <LogoutButton>
          <div className={cn(
            "text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer rounded-lg transition-colors flex shrink-0 items-center justify-center",
            minimized ? "p-2 w-full" : "p-2"
          )} title="Log out">
            <LogOut className="w-4 h-4" />
          </div>
        </LogoutButton>
      </div>
    </div>
  </div>
));
SidebarContent.displayName = "SidebarContent";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isMinimized } = useSidebar();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStartups, setActiveStartups] = useState<any[]>([]);
  const [isPublicView, setIsPublicView] = useState(false);

  useEffect(() => {
    if (session?.user?.role === "GOV_DEPARTMENT") {
      getGovDepartmentData().then((res) => {
        if (res && res.startups) {
          const sorted = res.startups.sort((a: any, b: any) => 
            (a.startupName || a.name || "").localeCompare(b.startupName || b.name || "")
          );
          setActiveStartups(sorted);
        }
      });
    }
  }, [session?.user?.role]);

  const toggleItem = useCallback((name: string) => {
    setOpenItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const userRole = session?.user?.role || "USER";

  // Use useMemo to prevent unnecessary calculations on every render
  const { publicGroups, adminGroups } = useMemo(() => {
    const pubGroups: NavGroup[] = [
      {
        label: "Core",
        items: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { 
            name: "Explore", 
            href: "/explore", 
            icon: Compass,
            items: [
              { name: "Startup Hubs", href: "/explore/gov-departments" },
              { name: "Programs", href: "/explore/programs" },
              { name: "Funding Opportunities", href: "/explore/funding-opportunities" },
              { name: "Events", href: "/explore/events" },
            ]
          },
          { name: "OS Daily", href: "/os-daily", icon: Newspaper },
          { name: "FixThis", href: "/fix-this", icon: Zap },
        ],
      },
    ];

    if (userRole === "GOV_DEPARTMENT") {
      pubGroups.push({
        label: "Management",
        items: [
          {
            name: "Portfolio",
            href: "/gov-department/portfolio",
            icon: UsersRound,
            items: [
              { name: "Analytics", href: "/gov-department/analytics" },
            ],
          },
          {
            name: "Active Startups",
            href: "/gov-department/portfolio",
            icon: Layers,
            items: activeStartups.map(s => ({
              name: s.startupName || s.name || "Unnamed",
              href: `/gov-department/portfolio/${s.id}`
            }))
          },
          {
            name: "Programs",
            href: "/gov-department/programs",
            icon: FileText,
          },
          {
            name: "Mentors",
            href: "/gov-department/mentors",
            icon: Users2,
            items: [
              { name: "Directory", href: "/gov-department/mentors" },
              { name: "Analytics", href: "/gov-department/mentors/analytics" },
            ],
          },
          {
            name: "Funding Opportunities",
            href: "/gov-department/funding-opportunities",
            icon: FileText,
          },
        ],
      });
    } else {
      pubGroups.push({
        label: "Workspace",
        items: [
          { name: "HubSpot", href: "/hubspot", icon: School },
          { name: "Applications", href: "/applications", icon: FileText },
          { name: "Upcoming Event", href: "/events", icon: Calendar },
        ],
      });
    }

    pubGroups.push({
      label: "Account",
      items: [
        { name: "Profile", href: "/profile", icon: User },
        ...(userRole !== "USER" ? [{ name: "Integrations", href: "/integrations", icon: Plug }] : []),
      ],
    });

    const admGroups: NavGroup[] = [
      {
        label: "System Analytics",
        items: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
      },
      {
        label: "Moderation",
        items: [
          { name: "Users", href: "/users", icon: Users },
          { name: "Startups", href: "/startups", icon: Rocket },
          { name: "Hub Requests", href: "/admin/hub-requests", icon: Shield },
        ],
      },
      {
        label: "Platform Management",
        items: [
          { name: "Events", href: "/gov-department/events", icon: Calendar },
          { name: "Programs", href: "/gov-department/programs", icon: FileText },
          { name: "Funding Opportunities", href: "/gov-department/funding-opportunities", icon: FileText },
          { name: "Content", href: "/content", icon: FileText },
          { name: "Communications", href: "/communications", icon: Bell },
          { name: "Settings", href: "/settings", icon: Settings },
        ],
      },
      {
        label: "Account",
        items: [
          { name: "Profile", href: "/profile", icon: User }
        ],
      },
    ];

    return { publicGroups: pubGroups, adminGroups: admGroups };
  }, [userRole, activeStartups]);

  const navGroups = isPublicView ? publicGroups : adminGroups;

  return (
    <>
      {/* Mobile Nav */}
      <nav className="lg:hidden fixed top-3 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[95%] max-w-6xl">
        {/* Top Bar */}
        <div className="bg-[#1A1A2E] rounded-full border border-white/10 px-4 sm:px-6 shadow-lg">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            <Link href="/" className="flex items-center group shrink-0 gap-2">
              <Image src="/logo/os-logo-white.svg" alt="OnlyStartups Logo" width={32} height={32} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-opacity duration-300 group-hover:opacity-80 shrink-0" />
              <Image
                src="/logo/os-fulltext-white.png"
                alt="OnlyStartups Text Logo"
                width={140}
                height={40}
                className="h-6 sm:h-7 md:h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>
            <button
              className="p-1.5 sm:p-2 text-white hover:text-[#F26522] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Spacer for fixed mobile nav */}
      <div className="lg:hidden h-16 sm:h-20 md:h-24" />

      {/* Mobile Side Sheet */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Sheet Panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-[70] w-[280px] bg-sidebar border-r border-sidebar-border shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          minimized={false}
          navGroups={navGroups}
          pathname={pathname}
          openItems={openItems}
          onToggle={toggleItem}
          session={session}
          isPublicView={isPublicView}
          setIsPublicView={setIsPublicView}
          userRole={userRole}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block h-screen sticky top-0 z-40 transition-all duration-300", isMinimized ? "w-20" : "w-64")}>
        <SidebarContent 
            minimized={isMinimized} 
            navGroups={navGroups}
            pathname={pathname}
            openItems={openItems}
            onToggle={toggleItem}
            session={session}
            isPublicView={isPublicView}
            setIsPublicView={setIsPublicView}
            userRole={userRole}
        />
      </aside>
    </>
  );
}
