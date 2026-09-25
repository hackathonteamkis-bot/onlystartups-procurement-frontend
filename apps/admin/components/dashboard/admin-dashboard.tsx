"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Users, Rocket, Target, Activity, Loader2 } from "lucide-react";
import { getAdminStats, getAnalyticsGrowth, getAnalyticsEngagement } from "@/actions/admin/admin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [growth, setGrowth] = useState<any>(null);
  const [engagement, setEngagement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, growthRes, engagementRes] = await Promise.all([
          getAdminStats(),
          getAnalyticsGrowth(),
          getAnalyticsEngagement(),
        ]);

        if (!statsRes.error) setStats(statsRes);
        if (!growthRes.error) setGrowth(growthRes);
        if (!engagementRes.error) setEngagement(engagementRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Format the growth data for Recharts (e.g. Roles breakdown)
  const roleData = growth?.users?.map((u: any) => ({
    name: u.role,
    count: u._count.id,
  })) || [];

  return (
    <div className="w-full min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 sm:py-10 shadow-xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2">
          System Overview
        </h1>
        <p className="text-white/80">Platform health and global analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#1A1A2E]/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1A2E]/60">Total Users</p>
                <p className="text-3xl font-bold text-[#1A1A2E]">{stats?.totalUsers || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1A1A2E]/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1A2E]/60">Verified Startups</p>
                <p className="text-3xl font-bold text-[#1A1A2E]">{stats?.usersByRole?.USER || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1A1A2E]/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1A2E]/60">Startup Hubs</p>
                <p className="text-3xl font-bold text-[#1A1A2E]">{stats?.usersByRole?.GOV_DEPARTMENT || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1A1A2E]/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1A2E]/60">Total Activities</p>
                <p className="text-3xl font-bold text-[#1A1A2E]">{stats?.totalActivities || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <Card className="col-span-1 border-[#1A1A2E]/5">
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Breakdown of registered platform users.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-white rounded-b-xl border-t border-gray-100 text-sm p-4">
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No data available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border-[#1A1A2E]/5 flex flex-col">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Recent events across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 bg-gray-50/50 rounded-b-xl border-t border-gray-100 p-0 overflow-hidden">
            <div className="h-[300px] overflow-y-auto p-4 space-y-4">
              {engagement?.recentActivities?.length > 0 ? (
                engagement.recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {activity.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-[#1A1A2E]/60">
                        {activity.user?.name || "Unknown"}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(activity.createdAt), "MMM d, p")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  No recent activities found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
