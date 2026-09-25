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
  startupHubApplications: any[];
  fundingOpportunityApplications: any[];
}

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
      ...(data.startupHubApplications || []).map((a: { id: string; startupHubId: string; status: string; createdAt: string; startupHub: any }) => ({
        ...a,
        type: "STARTUP_HUB" as const,
      })),
      ...(data.fundingOpportunityApplications || []).map((a: { id: string; startupHubId: string; status: string; createdAt: string; opportunity: any }) => ({
        ...a,
        type: "GRANT" as const,
        startupHub: a.opportunity.startupHub,
        title: a.opportunity.name,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    : [];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-20 p-4 sm:p-6 animate-in fade-in duration-500">
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
    <div className="max-w-5xl mx-auto space-y-10 pb-20 p-4 sm:p-6">
      {/* Header */}
      <PageHeader
        title="Your Applications"
        description="Track your startup hub admission status and venture scaling journey."
      />

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {applications.length > 0 ? (
            applications.map((app) => (
              <motion.div
                key={`${app.type}-${app.id}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-muted/60 p-6 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    {/* StartupHub Info */}
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Avatar className="h-16 w-16 rounded-2xl border-4 border-white shadow-lg ring-1 ring-muted">
                          <AvatarImage
                            src={app.startupHub.image || ""}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-[#1A1A2E] text-white font-bold text-lg">
                            {(
                              app.startupHub.startupName ||
                              app.startupHub.name ||
                              "?"
                            ).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-muted">
                          {app.type === "STARTUP_HUB" ? (
                            <Rocket className="w-3 h-3 text-primary" />
                          ) : (
                            <FileText className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-[#1A1A2E] truncate group-hover:text-primary transition-colors">
                          {app.type === "GRANT"
                            ? app.title
                            : app.startupHub.startupName || app.startupHub.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <StatusBadge status={app.status} />
                          <Badge
                            variant="outline"
                            className="text-[8px] font-black tracking-widest uppercase border-muted"
                          >
                            {app.type}
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            Applied{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {app.type === "GRANT" && (
                          <p className="text-[10px] font-bold text-muted-foreground mt-2 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            By {app.startupHub.startupName || app.startupHub.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/explore/startup-hubs/${app.startupHubId}`}
                        className="h-10 px-6 bg-[#1A1A2E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        View Hub
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="px-4 py-4 bg-muted/20 rounded-xl border border-muted/30">
                    <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                      {app.status === "PENDING"
                        ? `Your ${app.type.toLowerCase()} application is currently under review. We will notify you once a decision is made.`
                        : app.status === "APPROVED"
                          ? "Congratulations! Your venture has been selected. Check your email for next steps."
                          : "We appreciate your interest. Unfortunately, we cannot move forward with your application at this time."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-6 bg-muted/10 rounded-2xl border-2 border-dashed border-muted">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Building2 className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1A1A2E]">
                  No applications yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                  Apply to startup hubs and funding opportunities from the ecosystem hub
                  to start your venture scaling journey.
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
