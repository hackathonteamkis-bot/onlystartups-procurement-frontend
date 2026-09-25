import { getStartupDetails } from "@/actions/startup-hub";
import { StartupDetailsClient } from "@/components/startup-hub/startup-details-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";
import { notFound } from "next/navigation";

function StartupDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-full lg:w-[600px] rounded-xl" />
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}

async function StartupDetailsData({ startupId }: { startupId: string }) {
  const data = await getStartupDetails(startupId);
  
  if ("error" in data || !data) {
    if (data?.statusCode === 404) {
      notFound();
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-bold text-red-600">Failed to load startup details</h2>
          <p className="text-sm text-muted-foreground">{data.message || data.error}</p>
      </div>
    );
  }

  return <StartupDetailsClient startup={data} />;
}

export default async function StartupDetailsPage({ params }: { params: Promise<{ startupId: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<StartupDetailsSkeleton />}>
        <StartupDetailsData startupId={resolvedParams.startupId} />
      </Suspense>
    </div>
  );
}
