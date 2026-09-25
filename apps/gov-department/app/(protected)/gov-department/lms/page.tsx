export const dynamic = "force-dynamic";

import { getGovDepartmentData } from "@/actions/gov-department";
import { LMSClient } from "@/components/gov-department/lms-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";

function LMSSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-xl" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

async function LMSData() {
  const data = await getGovDepartmentData();
  
  if ("error" in data) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-xl font-bold text-red-600">Failed to load Knowledge Hub</h2>
              <p className="text-sm text-muted-foreground">{data.error}</p>
          </div>
      );
  }

  return <LMSClient initialData={data} />;
}

export default function LMSPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<LMSSkeleton />}>
        <LMSData />
      </Suspense>
    </div>
  );
}
