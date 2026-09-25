export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { UserRole } from "@/schemas";
import { getMeetups, getStartupHubMeetupRegistrations } from "@/actions/events";
import { PageHeader } from "@/components/shared/page-header";
import { EventsClient } from "@/components/events/events-client";

export default async function MeetupsPage() {
  const session = await auth();
  const isStartupHub = session?.user?.role === UserRole.STARTUP_HUB;

  const [allMeetups, hostedMeetupsResult] = await Promise.all([
    getMeetups(),
    isStartupHub ? getStartupHubMeetupRegistrations() : Promise.resolve([]),
  ]);

  const hostedMeetups =
    "error" in hostedMeetupsResult ? [] : hostedMeetupsResult;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Upcoming Event"
        description="Curating high-signal networking events and strategic masterclasses for tomorrow's builders."
      />

      <EventsClient
        initialMeetups={allMeetups}
        initialHostedMeetups={hostedMeetups}
        isStartupHub={isStartupHub}
      />
    </div>
  );
}
