export const dynamic = "force-dynamic";

import { getDashboardData } from "@/actions/dashboard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";
import { Card, CardContent, CardHeader } from "@onlystartups/ui";

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-48 rounded-xl" />
      </div>

      {/* Profile Card Skeleton */}
      <Card className="bg-[#1A1A2E] border-none overflow-hidden relative h-32 sm:h-40">
        <CardContent className="p-6 sm:p-8 relative z-10 h-full flex items-center">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-white/20 shrink-0 bg-white/10" />
            <div className="flex-1 w-full space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
              <Skeleton className="h-8 w-48 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="border-[#1A1A2E]/5 bg-white/40 h-28">
            <CardContent className="p-6 flex flex-col justify-center h-full space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#1A1A2E]/5 bg-white/40 min-h-[320px]">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1A1A2E]/5 bg-white/40 min-h-[320px]">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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
