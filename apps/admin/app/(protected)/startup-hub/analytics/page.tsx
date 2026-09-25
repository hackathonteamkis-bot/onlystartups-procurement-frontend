export const dynamic = "force-dynamic";

import { currentUser } from "@/lib/auth";
import { getAnalytics, getDailyAnalytics, getEventsAnalytics } from "@/actions/dashboard/analytics";
import { AnalyticsClient } from "@/components/dashboard/analytics-client";
import { Suspense } from "react";
import { Skeleton } from "@onlystartups/ui";

function AnalyticsSkeleton() {
    return (
        <div className="space-y-8 p-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
    );
}

async function AnalyticsData() {
    const user = await currentUser();
    if (!user || !user.id) return null;

    const [stats, dailyStats, eventStats] = await Promise.all([
        getAnalytics(user.id),
        getDailyAnalytics(user.id),
        getEventsAnalytics(user.id)
    ]);

    return (
        <AnalyticsClient
            initialStats={stats}
            initialDailyStats={dailyStats}
            initialEventStats={eventStats}
        />
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsData />
        </Suspense>
    );
}
