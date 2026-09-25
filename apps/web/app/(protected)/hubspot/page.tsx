import { getHubSpotData } from "@/actions/hubspot";
import { HubSpotClient } from "@/components/hubspot/hubspot-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@onlystartups/ui";

function HubSpotSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <Skeleton className="h-[400px] w-full rounded-xl col-span-1" />
        <Skeleton className="h-[600px] w-full rounded-xl col-span-2" />
        <Skeleton className="h-[400px] w-full rounded-xl col-span-1" />
      </div>
    </div>
  );
}

async function HubSpotData() {
  const data = await getHubSpotData();
  
  if ("error" in data || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-red-500/10 p-4 rounded-full">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white">My Pilots Unavailable</h2>
        <p className="text-muted-foreground max-w-md">{data?.message || data?.error || 'You must be working on an active pilot with a Government Department to access this.'}</p>
        <Link href="/explore">
          <Button className="mt-4 bg-[#F26522] hover:bg-[#F26522]/90 text-white">
            Explore Gov Departments
          </Button>
        </Link>
      </div>
    );
  }

  return <HubSpotClient data={data} />;
}

  export default function HubSpotPage() {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<HubSpotSkeleton />}>
        <HubSpotData />
      </Suspense>
    </div>
  );
}
