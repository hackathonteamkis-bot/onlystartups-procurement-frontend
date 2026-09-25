"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { SharingCard } from "@/components/startup-hub/sharing-card";
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary";
import { PipelineBarChart, TrafficPieChart, FunnelBarChart, FundingBarChart, DemographicsPieChart, StageBarChart } from "@/components/dashboard/charts";
import {
  Users,
  TrendingUp,
  Target,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  BarChart3,
  Filter,
  Globe2,
  IndianRupee,
  AlertTriangle,
  Briefcase,
  UserPlus,
  Send,
  MessageSquare,
  Activity,
  Star,
  MapPin,
  ListTodo
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@onlystartups/ui";
import { getStartupHubStats } from "@/actions/startup-hub";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// --- MOCK DATA ---
const mockPipelineData = [
  { month: "Jan", applications: 12, accepted: 4 },
  { month: "Feb", applications: 19, accepted: 7 },
  { month: "Mar", applications: 15, accepted: 5 },
  { month: "Apr", applications: 22, accepted: 10 },
  { month: "May", applications: 30, accepted: 14 },
  { month: "Jun", applications: 45, accepted: 20 },
];

const mockFundingData = [
  { month: "Q1", raised: 250000 },
  { month: "Q2", raised: 800000 },
  { month: "Q3", raised: 1200000 },
  { month: "Q4", raised: 3500000 },
];

const mockFunnelData = [
  { step: "Page Views", count: 1200 },
  { step: "Drafts", count: 450 },
  { step: "Submitted", count: 150 },
  { step: "Interviewed", count: 60 },
  { step: "Accepted", count: 20 },
];

const mockTrafficData = [
  { name: "Direct", value: 400 },
  { name: "LinkedIn", value: 300 },
  { name: "Twitter", value: 100 },
  { name: "Referral", value: 200 },
];

const mockIndustryData = [
  { name: "FinTech", value: 35 },
  { name: "HealthTech", value: 25 },
  { name: "SaaS", value: 20 },
  { name: "AI/ML", value: 20 },
];

const mockStageData = [
  { stage: "Pre-Seed", count: 60 },
  { stage: "Seed", count: 45 },
  { stage: "Series A", count: 15 },
];

const mockGeoData = [
  { city: "Maharashtra", percentage: 35 },
  { city: "Karnataka", percentage: 25 },
  { city: "Delhi", percentage: 20 },
  { city: "Gujarat", percentage: 10 },
  { city: "Other", percentage: 10 },
];

const MOCK_APPLICATIONS = [
  {
    id: "1",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: { name: "Alice Founder", startupName: "AeroDynamics", image: "https://github.com/shadcn.png" }
  },
  {
    id: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: { name: "Bob Builder", startupName: "BuildIt SaaS" }
  },
  {
    id: "3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user: { name: "Charlie Chaplin", startupName: "ComedyAI" }
  }
];

const MOCK_AT_RISK = [
  { id: "1", name: "GreenEnergy Co", issue: "Missed Milestone: Seed Deck", daysIdle: 14 },
  { id: "2", name: "EduPlatform", issue: "No logins in 30 days", daysIdle: 32 },
  { id: "3", name: "HealthSync", issue: "Low mentor engagement", daysIdle: 8 },
];

const MOCK_ACTIVITY_FEED = [
  { id: 1, action: "AeroDynamics updated their pitch deck", time: "10 mins ago", icon: FileCheck },
  { id: 2, action: "BuildIt booked a mentor session with John Doe", time: "2 hours ago", icon: Target },
  { id: 3, action: "New application received from FintechFlow", time: "4 hours ago", icon: UserPlus },
  { id: 4, action: "ComedyAI completed milestone 'Launch Beta'", time: "1 day ago", icon: Star },
];

const MOCK_MENTORS = [
  { id: 1, name: "Sarah Connor", expertise: "GTM Strategy", sessions: 24, rating: 4.9 },
  { id: 2, name: "David Chen", expertise: "Fundraising", sessions: 18, rating: 4.8 },
  { id: 3, name: "Elena Rodriguez", expertise: "Product Design", sessions: 15, rating: 4.9 },
];

type TabType = "overview" | "pipeline" | "health" | "demographics";

const GLASS_CARD = "bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl shadow-sm py-0 gap-0";

export function StartupHubDashboard({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const summaryStats = [
    { label: "Active Programs", value: "4", icon: Users, trend: "+1 from last month" },
    { label: "Portfolio Startups", value: "142", icon: TrendingUp, trend: "+12 this quarter" },
    { label: "Pending Milestones", value: "28", icon: Target, trend: "Requires review", alert: true },
    { label: "New Applications", value: "14", icon: FileCheck, trend: "+5 this week", alert: true },
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in w-full px-1 sm:px-2 pb-12">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex items-center gap-4 border-b border-slate-200/50 pb-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 pt-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-[320px] rounded-xl w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[320px] rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-12 w-full px-1 sm:px-2">
      {/* Clean, Professional Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Welcome back, {session?.user?.startupName || `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || "Partner"}.
          </p>
        </div>
        <Badge variant="outline" className="bg-white/60 backdrop-blur-md text-slate-700 border-slate-100 shadow-sm font-medium px-3 py-1 w-full sm:w-auto justify-center sm:justify-start">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Administrator View
        </Badge>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200/50 overflow-x-auto hide-scrollbar pb-px -mx-1 px-1 sm:mx-0 sm:px-0">
        {[
          { id: "overview", label: "Overview" },
          { id: "pipeline", label: "Pipeline" },
          { id: "health", label: "Portfolio Health" },
          { id: "demographics", label: "Demographics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "py-2 px-1 text-sm sm:text-base font-bold transition-colors border-b-2 whitespace-nowrap",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryStats.map((stat, i) => (
                <Card key={i} className={GLASS_CARD}>
                  <div className="block w-full h-full p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                      <stat.icon className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        {stat.alert && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" />}
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{stat.trend}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4 flex flex-col min-w-0">
                <Card className={cn(GLASS_CARD, "flex-1 overflow-hidden")}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-bold text-slate-900 truncate">Application Pipeline Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 px-2 sm:px-5 pb-5 w-full overflow-x-auto">
                    <div className="min-w-[400px]">
                       <PipelineBarChart data={mockPipelineData} height={250} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <Card className={cn(GLASS_CARD, "flex flex-col h-[320px] lg:h-auto lg:min-h-[320px]")}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-bold text-slate-900">Live Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1">
                    <div className="divide-y divide-white/20">
                      {MOCK_ACTIVITY_FEED.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 px-4 sm:px-5 hover:bg-slate-50 transition-colors">
                          <div className="bg-slate-900/5 p-1.5 rounded-full shrink-0 mt-0.5">
                            <item.icon className="w-3 h-3 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 leading-snug">{item.action}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ===================== PIPELINE TAB ===================== */}
        {activeTab === "pipeline" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className={cn(GLASS_CARD, "overflow-hidden")}>
                <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                  <CardTitle className="text-sm font-bold text-slate-900 truncate">Conversion Funnel Drop-off</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-2 sm:px-5 pb-5 w-full overflow-x-auto">
                   <div className="min-w-[300px]">
                     <FunnelBarChart data={mockFunnelData} height={220} />
                   </div>
                </CardContent>
              </Card>

              <Card className={GLASS_CARD}>
                <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                  <CardTitle className="text-sm font-bold text-slate-900 truncate">Traffic Acquisition Sources</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-4 sm:px-5 pb-5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 w-full flex items-center justify-center min-h-[220px]">
                    <TrafficPieChart data={mockTrafficData} height={220} />
                  </div>
                  <div className="shrink-0 space-y-2 w-full md:w-auto flex flex-row flex-wrap md:flex-col justify-center gap-x-4 gap-y-2">
                     {mockTrafficData.map((t, idx) => (
                       <div key={idx} className="flex items-center gap-2.5">
                         <div className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: ["#F26522", "#3B82F6", "#10B981", "#A855F7"][idx] }} />
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">{t.name}</span>
                            <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap">{t.value} visitors</span>
                         </div>
                       </div>
                     ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <AnalyticsSummary startupHubId={session?.user?.id || ""} className={GLASS_CARD} />
          </div>
        )}

        {/* ===================== HEALTH TAB ===================== */}
        {activeTab === "health" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4 min-w-0">
                <Card className={cn(GLASS_CARD, "overflow-hidden")}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-sm font-bold text-slate-900 truncate">Portfolio Capital Raised</CardTitle>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-bold shadow-sm self-start sm:self-auto">
                        Total: ₹5.75M
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 px-2 sm:px-5 pb-5 w-full overflow-x-auto">
                    <div className="min-w-[400px]">
                      <FundingBarChart data={mockFundingData} height={250} />
                    </div>
                  </CardContent>
                </Card>

                {/* Mentor Engagement Table */}
                <Card className={cn(GLASS_CARD, "overflow-hidden")}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-bold text-slate-900">Top Mentor Engagement</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-xs text-left min-w-[500px]">
                        <thead className="text-[10px] text-slate-500 bg-slate-50 border-b border-slate-100 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 sm:px-5 py-2.5 font-bold">Mentor</th>
                            <th className="px-4 sm:px-5 py-2.5 font-bold">Expertise</th>
                            <th className="px-4 sm:px-5 py-2.5 font-bold">Sessions</th>
                            <th className="px-4 sm:px-5 py-2.5 font-bold">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                          {MOCK_MENTORS.map((mentor) => (
                            <tr key={mentor.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 sm:px-5 py-3 font-bold text-slate-900 whitespace-nowrap">{mentor.name}</td>
                              <td className="px-4 sm:px-5 py-3 text-slate-600 font-medium whitespace-nowrap">{mentor.expertise}</td>
                              <td className="px-4 sm:px-5 py-3 text-slate-900 font-bold whitespace-nowrap">{mentor.sessions}</td>
                              <td className="px-4 sm:px-5 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-slate-700 font-medium">
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  {mentor.rating}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <Card className="border-none shadow-xl bg-white/60 backdrop-blur-md rounded-2xl flex flex-col h-[320px] lg:h-auto lg:min-h-[300px]">
                  <CardHeader className="border-b border-rose-200/50 pb-3 pt-4 px-4 sm:px-5 bg-rose-50/30 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold text-rose-900">Startups at Risk</CardTitle>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">{MOCK_AT_RISK.length}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1">
                    <div className="divide-y divide-rose-100/30">
                      {MOCK_AT_RISK.map((startup) => (
                        <div key={startup.id} className="p-4 px-4 sm:px-5 hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{startup.name}</p>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">{startup.daysIdle} days idle</span>
                          </div>
                          <p className="text-[10px] text-rose-600 font-semibold">{startup.issue}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ===================== DEMOGRAPHICS TAB ===================== */}
        {activeTab === "demographics" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 items-start">
              <div className="flex flex-col gap-4">
                <Card className={GLASS_CARD}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-bold text-slate-900">Portfolio Industry Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 px-4 sm:px-5 pb-5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full flex items-center justify-center min-h-[220px]">
                      <DemographicsPieChart data={mockIndustryData} height={220} />
                    </div>
                    <div className="shrink-0 space-y-2 w-full md:w-auto flex flex-row flex-wrap md:flex-col justify-center gap-x-4 gap-y-2">
                       {mockIndustryData.map((t, idx) => (
                         <div key={idx} className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded shadow-sm shrink-0" style={{ backgroundColor: ["#F26522", "#3B82F6", "#10B981", "#A855F7"][idx] }} />
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{t.name}</span>
                              <span className="text-[9px] font-medium text-slate-500">{t.value}%</span>
                           </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(GLASS_CARD, "overflow-hidden")}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-bold text-slate-900">Startup Stages</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 px-2 sm:px-5 pb-5 w-full overflow-x-auto">
                    <div className="min-w-[300px]">
                      <StageBarChart data={mockStageData} height={160} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col h-full w-full">
                <Card className={cn(GLASS_CARD, "h-full w-full")}>
                  <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5">
                    <CardTitle className="text-sm font-bold text-slate-900">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/20">
                      {mockGeoData.map((loc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 px-4 sm:px-5 hover:bg-slate-50 transition-colors gap-2">
                          <span className="text-xs font-bold text-slate-700 truncate">{loc.city}</span>
                          <span className="text-xs font-black text-slate-500 shrink-0">{loc.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
