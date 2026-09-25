"use client";


import { useEffect, useState } from "react";
import { getApplicationsData } from "@/actions/explore/apply";
import {
  Clock,
  Building2,
  ChevronRight,
  Rocket,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";

interface ApplicationData {
  govDepartmentApplications: any[];
  fundingOpportunityApplications: any[];
}

const formatTimelineDate = (dateString: string) => {
  const d = new Date(dateString);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  if (year === currentYear) {
      return `${month} ${day}`;
  }
  return `${month} ${day}, ${year}`;
};

const formatDay = (dateString: string) => {
  return new Date(dateString).toLocaleString('default', { weekday: 'long' });
};

export default function UserApplicationsPage() {
  const [data, setData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await getApplicationsData();
      if (!("error" in res)) {
        setData(res);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const applications = data
    ? [
      ...(data.govDepartmentApplications || []).map((a: { id: string; govDepartmentId: string; status: string; createdAt: string; govDepartment: any; program?: any; programId?: string }) => ({
        ...a,
        type: a.programId ? "PROGRAM" as const : "GOV_DEPARTMENT" as const,
        title: a.programId ? a.program?.name : undefined,
      })),
      ...(data.fundingOpportunityApplications || []).map((a: { id: string; govDepartmentId: string; status: string; createdAt: string; opportunity: any }) => ({
        ...a,
        type: "GRANT" as const,
        govDepartment: a.opportunity.govDepartment,
        title: a.opportunity.name,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    : [];

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-muted/60 p-6 rounded-2xl flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-center gap-5">
                  <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title="Submitted Solutions"
        description="Track the status of your submitted solutions."
      />

      <div className="relative">
        <AnimatePresence mode="popLayout">
          {applications.length > 0 ? (
            <div className="rounded-2xl border border-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-black/10 text-[#1A1A2E]/60 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Application</th>
                      <th className="px-6 py-4 whitespace-nowrap">Host</th>
                      <th className="px-6 py-4 whitespace-nowrap">Date Applied</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/60">
                    {applications.map((app) => (
                      <tr key={`${app.type}-${app.id}`} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#1A1A2E]">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-lg shadow-sm border border-muted/20 shrink-0">
                              <AvatarImage
                                src={app.govDepartment.image || ""}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-[#1A1A2E] text-white font-bold text-[10px]">
                                {(
                                  app.govDepartment.startupName ||
                                  app.govDepartment.name ||
                                  "?"
                                ).charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate max-w-[200px] inline-block">
                              {app.type === "GRANT" || app.type === "PROGRAM"
                                ? app.title
                                : app.govDepartment.startupName || app.govDepartment.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap">
                          {app.govDepartment.startupName || app.govDepartment.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Link
                            href={app.type === "PROGRAM" ? `/explore/gov-departments/${app.govDepartmentId}/programs/${app.programId}` : `/explore/gov-departments/${app.govDepartmentId}`}
                            className="text-[#F26522] font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            View Application
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-xl border border-[#F5F5EE] shadow-sm relative z-10">
              <div className="w-20 h-20 rounded-xl bg-[#F5F5EE]/50 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-[#1A1A2E]/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1A1A2E]">
                  No solutions submitted yet
                </h3>
                <p className="text-sm text-[#1A1A2E]/60 max-w-xs mx-auto font-medium">
                  Submit solutions to problem statements and tenders to start your venture scaling journey.
                </p>
              </div>
              <Link href="/explore">
                <button className="px-8 py-3 bg-[#1A1A2E] text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-[#1A1A2E]/20 transition-all">
                  Explore Ecosystem
                </button>
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; icon: any }> = {
    PENDING: { style: "bg-amber-100 text-amber-700", icon: Clock },
    APPROVED: { style: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    REJECTED: { style: "bg-red-100 text-red-700", icon: XCircle },
  };

  const { style, icon: Icon } = config[status];

  return (
    <Badge
      className={cn(
        "border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-sm",
        style,
      )}
    >
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
}
