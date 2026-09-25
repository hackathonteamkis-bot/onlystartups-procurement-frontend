export const dynamic = "force-dynamic";

import { getHubMentorById } from "@/actions/mentors";
import { getStartupHubData } from "@/actions/startup-hub";
import { MentorProfileClient } from "@/components/startup-hub/mentor-profile-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";
import { notFound } from "next/navigation";

function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-[400px] rounded-xl md:col-span-1" />
        <Skeleton className="h-[400px] rounded-xl md:col-span-2" />
      </div>
    </div>
  );
}

async function ProfileData({ id }: { id: string }) {
  const profile = await getHubMentorById(id);
  
  if ("error" in profile || !profile) {
    if (profile.error?.includes('404')) return notFound();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-bold text-red-600">Failed to load mentor profile</h2>
            <p className="text-sm text-muted-foreground">{profile.error}</p>
        </div>
    );
  }

  const hubData = await getStartupHubData();
  const startups = hubData && !('error' in hubData) ? hubData.startups : [];

  return <MentorProfileClient profile={profile} startups={startups} />;
}

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileData id={id} />
      </Suspense>
    </div>
  );
}
