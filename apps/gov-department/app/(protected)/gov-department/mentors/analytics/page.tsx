export const dynamic = "force-dynamic";

import { getHubMentorAnalytics } from "@/actions/mentors";
import { MentorAnalyticsClient } from "@/components/gov-department/mentor-analytics-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  );
}

async function AnalyticsData() {
  const data = await getHubMentorAnalytics();
  
  if ("error" in data) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-bold text-red-600">Failed to load analytics</h2>
            <p className="text-sm text-muted-foreground">{data.error}</p>
        </div>
    );
  }

  return <MentorAnalyticsClient data={data} />;
}

export default function MentorAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsData />
      </Suspense>
    </div>
  );
}
