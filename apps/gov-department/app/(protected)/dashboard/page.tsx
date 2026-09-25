export const dynamic = "force-dynamic";

import { getDashboardData } from "@/actions/dashboard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";


function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in w-full px-1 sm:px-2 pb-12">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-4 border-b border-slate-200/50 pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4 pt-2">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[320px] rounded-xl w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[320px] rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function DashboardData() {
  const data = await getDashboardData();

  return (
    <DashboardClient
      initialActivities={data.activities || []}
      initialStats={data.stats}
      initialUser={data.user}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
