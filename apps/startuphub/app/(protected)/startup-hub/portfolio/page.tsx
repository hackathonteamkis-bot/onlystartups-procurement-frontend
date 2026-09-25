export const dynamic = "force-dynamic";

import { getStartupHubData } from "@/actions/startup-hub";
import { PortfolioClient } from "@/components/startup-hub/portfolio-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";

function PortfolioSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  );
}

async function PortfolioData() {
  const data = await getStartupHubData();
  
  if ("error" in data) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-xl font-bold text-red-600">Failed to load portfolio</h2>
              <p className="text-sm text-muted-foreground">{data.error}</p>
          </div>
      );
  }

  return <PortfolioClient initialData={data} />;
}

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioData />
      </Suspense>
    </div>
  );
}
