"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { SharingCard } from "@/components/gov-department/sharing-card";
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary";
import {
  Users,
  TrendingUp,
  Target,
  FileCheck,
  BookOpen,
  Users2,
  ShieldCheck,
  Activity,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@onlystartups/ui";
import { getGovDepartmentStats } from "@/actions/gov-department";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface GovDepartmentStats {
  activePrograms?: number | string;
  startupsTracked?: number | string;
  pendingMilestones?: number | string;
  pendingApplications?: number | string;

  recentApplications?: {
    id: string;
    createdAt: string;
    user: {
      name: string;
      image?: string;
      startupName?: string;
    };
  }[];
  resourceCount?: number | string;
  mentorSessions?: any[];
  fundingOpportunityReportsDue?: number | string;
  totalReach?: number | string;
}

export function GovDepartmentDashboard({ initialData }: { initialData?: GovDepartmentStats }) {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statsData, setStatsData] = useState<GovDepartmentStats | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  const fetchData = useCallback(async () => {
    const data = await getGovDepartmentStats();
    if (!("error" in data)) {
      setStatsData(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!initialData) {
      void (async () => {
        const data = await getGovDepartmentStats();
        if (isMounted && !("error" in data)) {
          setStatsData(data);
          setLoading(false);
        }
      })();
    }
    return () => { isMounted = false; };
  }, [initialData]);

  // Real-time subscriptions
  useEffect(() => {
    if (!session?.user?.id || session.user.role !== "GOV_DEPARTMENT") return;

    const userId = session.user.id;

    // Subscribe to applications
    const appsChannel = supabase
      .channel(`gov-department-apps-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
          filter: `govDepartment_id=eq.${userId}`,
        },
        (_payload) => {
          toast.success("New startup application received!");
          void fetchData();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
          filter: `govDepartment_id=eq.${userId}`,
        },
        () => {
          void fetchData();
        },
      )
      .subscribe();

    // Subscribe to milestones
    const milestonesChannel = supabase
      .channel(`govDepartment-milestones-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
        },
        () => {
          void fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appsChannel);
      supabase.removeChannel(milestonesChannel);
    };
  }, [session?.user?.id, session?.user?.role, fetchData]);

  const summaryStats = [
    {
      label: "Programs",
      value: statsData?.activePrograms || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      description: "Active batches"
    },
    {
      label: "Portfolio",
      value: statsData?.startupsTracked || "0",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      description: "Startups tracked"
    },
    {
      label: "Milestones",
      value: statsData?.pendingMilestones || "0",
      icon: Target,
      color: "text-orange-600",
      bg: "bg-orange-100",
      description: "Pending tasks"
    },
    {
      label: "Applications",
      value: statsData?.pendingApplications || "0",
      icon: FileCheck,
      color: "text-purple-600",
      bg: "bg-purple-100",
      description: "New candidates",
      href: "/gov-department/applications",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pt-4 sm:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-xl" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="border-none shadow-sm bg-white/60 h-[104px]"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] tracking-tight">
            Startup Hub Overview, {session?.user?.startupName || `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || "Partner"}!
          </h1>
          <p className="text-[#1A1A2E]/60 text-xs sm:text-sm font-medium">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge className="w-fit bg-[#1A1A2E] text-white border-none font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2">
            <ShieldCheck className="w-3 h-3 mr-2 text-[#F26522]" />
            Startup Hub Admin
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summaryStats.map((stat, i) => {
          const CardWrapper = stat.href ? "a" : "div";
          return (
            <Card
              key={i}
              className={cn(
                "border-none shadow-sm bg-white/60 transition-all rounded-2xl",
                stat.href && "hover:shadow-md cursor-pointer border border-transparent hover:border-[#F26522]/10",
              )}
            >
              <CardWrapper href={stat.href} className="block w-full h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-[#1A1A2E]/40 uppercase tracking-widest">
                        {stat.label}
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-[#1A1A2E] mt-0.5 sm:mt-1">
                        {stat.value}
                      </p>
                      <p className="hidden sm:block text-[10px] font-medium text-[#1A1A2E]/30 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`${stat.bg} p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0`}>
                      <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </CardWrapper>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Applications */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Applications</CardTitle>
              <Badge variant="secondary" className="bg-[#1A1A2E]/5 text-[#1A1A2E]/60 border-none font-bold">
                {statsData?.pendingApplications || 0} New
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {statsData?.recentApplications && statsData.recentApplications.length > 0 ? (
              <div className="px-2">
                {statsData.recentApplications.map((app: any) => (
                  <Link
                    key={app.id}
                    href="/gov-department/applications"
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-[#1A1A2E]/5 group mb-1"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={app.user?.image} />
                      <AvatarFallback className="bg-[#F26522]/10 text-[#F26522] font-bold text-xs">
                        {app.user?.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-[#1A1A2E] truncate group-hover:text-[#F26522] transition-colors line-clamp-1">
                        {app.user?.startupName || app.user?.name}
                      </h5>
                      <p className="text-[10px] text-[#1A1A2E]/40 font-medium">
                        {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center h-full">
                <p className="text-sm text-[#1A1A2E]/40">No new applications</p>
              </div>
            )}
          </CardContent>
          <div className="p-4 mt-auto">
            <Link href="/gov-department/applications" className="w-full py-2 bg-[#1A1A2E] text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F26522] transition-colors">
              GOTO APPS <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Recruiting & Growth */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SharingCard
            govDepartmentId={session?.user?.id || ""}
            govDepartmentName={session?.user?.startupName || `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || "OnlyStartups"}
          />
        </div>
        <div className="lg:col-span-2">
          <AnalyticsSummary govDepartmentId={session?.user?.id || ""} />
        </div>
      </div>

      {/* Feature Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "SMS Resources",
            value: statsData?.resourceCount || "0",
            desc: "Legal & workshops",
            icon: BookOpen,
            color: "text-purple-600",
            href: "/gov-department/lms",
            badge: "Update"
          },
          {
            title: "Grant Reports",
            value: statsData?.fundingOpportunityReportsDue || "0",
            desc: "Financial tracking",
            icon: Target,
            color: "text-blue-600",
            href: "/gov-department/grants",
            badge: "Pending"
          },
          {
            title: "Global Reach",
            value: statsData?.totalReach || "0",
            desc: "Founder interest",
            icon: Activity,
            color: "text-orange-600",
            href: "/gov-department/analytics",
            badge: "Active"
          }
        ].map((feat, i) => (
          <a
            key={i}
            href={feat.href}
            className="group hover:border-[#F26522]/20 transition-all cursor-pointer border border-transparent shadow-none bg-white/60 hover:shadow-xl hover:shadow-[#F26522]/5 p-6 rounded-2xl relative overflow-hidden h-full flex flex-col justify-end"
          >
            <div className="absolute top-4 right-4">
              <Badge className={cn(
                "border-none font-black text-[9px] uppercase tracking-widest",
                feat.badge === "Live" ? "bg-green-100 text-green-600 animate-pulse" : "bg-[#1A1A2E]/5 text-[#1A1A2E]/40"
              )}>
                {feat.badge}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#1A1A2E]/30 uppercase tracking-widest">{feat.title}</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] leading-none mb-1">{feat.value}</h3>
              <p className="text-[10px] text-[#1A1A2E]/50 font-bold uppercase tracking-wider truncate">{feat.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
