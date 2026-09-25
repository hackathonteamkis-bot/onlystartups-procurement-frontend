"use server";

import { fetchWithAuth } from "@/lib/api";

export const getDashboardData = async () => {
  try {
    // Fire-and-forget: ensure welcome activity exists
    fetchWithAuth('/activities/ensure-welcome', {
      method: 'POST',
      cache: 'no-store',
    }).catch(() => {});

    // Fetch dashboard data in parallel with no caching
    // (this page uses force-dynamic, so fresh data is expected)
    const [activities, stats, profile] = await Promise.all([
      fetchWithAuth('/activities', { cache: 'no-store' }),
      fetchWithAuth('/dashboard/stats', { cache: 'no-store' }),
      fetchWithAuth('/auth/profile', { cache: 'no-store' }),
    ]);

    return {
      activities,
      stats,
      user: profile,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      activities: [],
      stats: { matchCount: 0, agreementCount: 0 },
      user: null,
    };
  }
};
