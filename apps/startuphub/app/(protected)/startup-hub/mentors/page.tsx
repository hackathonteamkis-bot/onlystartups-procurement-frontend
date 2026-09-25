export const dynamic = "force-dynamic";

import { getHubMentors } from "@/actions/mentors";
import { MentorsClient } from "@/components/startup-hub/mentors-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";

function MentorsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

async function MentorsData() {
  const mentors = await getHubMentors();
  
  if ("error" in mentors) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-xl font-bold text-red-600">Failed to load mentors</h2>
              <p className="text-sm text-muted-foreground">{mentors.error}</p>
          </div>
      );
  }

  return <MentorsClient initialData={mentors} />;
}

export default function MentorsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<MentorsSkeleton />}>
        <MentorsData />
      </Suspense>
    </div>
  );
}
