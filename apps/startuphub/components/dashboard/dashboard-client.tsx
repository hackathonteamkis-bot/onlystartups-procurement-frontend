"use client";

import { useSession } from "next-auth/react";
import {
    Users,
    Sparkles,
    ArrowUpRight,
    Rocket,
    Clock,
    Activity,
    Eye,
    CheckCircle2
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
import { type ExtendedUser } from "@/next-auth";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { StartupHubDashboard } from "@/components/dashboard/startup-hub-dashboard";
import { cn } from "@/lib/utils";
import { ActivityAreaChart } from "@/components/dashboard/charts";

interface DashboardActivity {
    id: string;
    type: string;
    message: string;
    createdAt: string | Date;
}

interface DashboardClientProps {
    initialActivities: DashboardActivity[];
    initialStats: {
        matchCount?: number;
        agreementCount?: number;
        meetupCount?: number;
        ecosystemCount?: number;
    };
    initialUser: ExtendedUser;
}

// Calculate profile completion percentage
function calculateProfileCompletion(user: Partial<ExtendedUser>) {
    if (!user) return 0;
    const fields = [
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        user.bio,
        user.image,
        user.bannerImage,
        user.twitter,
        user.linkedin,
        user.instagram,
        user.startupName,
        user.startupDescription,
        user.startupPhase,
        user.title,
        user.skills && (user.skills as string[]).length > 0,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
}

// Get greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

const mockActivityData = [
  { date: "10 Jul", activity: 4, profileViews: 12 },
  { date: "11 Jul", activity: 7, profileViews: 18 },
  { date: "12 Jul", activity: 5, profileViews: 15 },
  { date: "13 Jul", activity: 12, profileViews: 25 },
  { date: "14 Jul", activity: 9, profileViews: 22 },
  { date: "15 Jul", activity: 15, profileViews: 35 },
  { date: "16 Jul", activity: 22, profileViews: 45 },
];

export function DashboardClient({
    initialActivities,
    initialStats,
    initialUser
}: DashboardClientProps) {
    const { data: session } = useSession();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activities, setActivities] = useState<DashboardActivity[]>(initialActivities);
    const [stats, setStats] = useState<DashboardClientProps["initialStats"]>(initialStats);
    const [realtimeUser, setRealtimeUser] = useState<Partial<ExtendedUser> | null>(null);
    const [dbUserData, setDbUserData] = useState<ExtendedUser>(initialUser);

    const liveUser = realtimeUser
        ? { ...session?.user, ...dbUserData, ...realtimeUser }
        : { ...session?.user, ...dbUserData };

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Subscribe to real-time events
    useEffect(() => {
        if (!session?.user?.id) return;

        const activitiesChannel = supabase
            .channel(`user-activities-${session.user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "activities",
                    filter: `user_id=eq.${session.user.id}`,
                },
                (payload) => {
                    const newActivity = payload.new as DashboardActivity;
                    setActivities((current) => [newActivity, ...current.slice(0, 9)]);
                    toast.success("New activity: " + newActivity.message);
                },
            )
            .subscribe();

        // User profile updates
        const userChannel = supabase
            .channel(`user-profile-${session.user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "users",
                    filter: `id=eq.${session.user.id}`,
                },
                (payload) => {
                    setRealtimeUser((prev) => ({
                        ...prev,
                        ...(payload.new as Partial<ExtendedUser>),
                    }));
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(activitiesChannel);
            supabase.removeChannel(userChannel);
        };
    }, [session?.user?.id]);

    const profileCompletion = liveUser ? calculateProfileCompletion(liveUser) : 0;

    // Get missing profile fields for recommendations
    const getMissingFields = () => {
        if (!session?.user) return [];
        const missing = [];
        if (!session.user.bio) missing.push("bio");
        if (!session.user.startupName) missing.push("startup name");
        if (!session.user.image) missing.push("profile picture");
        if (!session.user.bannerImage) missing.push("banner image");
        if (!session.user.twitter && !session.user.linkedin)
            missing.push("social links");
        return missing;
    };

    const missingFields = getMissingFields();

    if (session?.user?.role === "STARTUP_HUB") {
        return <StartupHubDashboard initialData={stats as any} />;
    }

    return (
        <div className="w-full min-w-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Sleek Top Welcome Bar (GHL Style) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A1A2E]/5 pb-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-transparent shadow-sm">
                        <AvatarImage src={liveUser?.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-[#F26522] text-white font-bold">
                            {liveUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">
                            {getGreeting()}, {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim()?.split(" ")[0] || "Founder"}
                        </h1>
                        <p className="text-sm font-medium text-[#1A1A2E]/60">
                            {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="border-[#1A1A2E]/10 bg-white shadow-sm font-bold text-xs py-1.5 px-3 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" />
                    Profile {profileCompletion}% Complete
                </Badge>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-white/60">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Profile Views</p>
                            <p className="text-2xl font-black text-[#1A1A2E] mt-1">172</p>
                        </div>
                        <div className="bg-blue-500/10 p-2.5 rounded-xl">
                            <Eye className="w-5 h-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/60">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Connections</p>
                            <p className="text-2xl font-black text-[#1A1A2E] mt-1">{stats?.matchCount || 24}</p>
                        </div>
                        <div className="bg-purple-500/10 p-2.5 rounded-xl">
                            <Users className="w-5 h-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/60">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Agreements</p>
                            <p className="text-2xl font-black text-[#1A1A2E] mt-1">{stats?.agreementCount || 5}</p>
                        </div>
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-[#1A1A2E] text-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Platform Rank</p>
                            <p className="text-2xl font-black text-white mt-1">Top 5%</p>
                        </div>
                        <div className="bg-[#F26522]/20 p-2.5 rounded-xl">
                            <Rocket className="w-5 h-5 text-[#F26522]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas - 2/3 and 1/3 split like GHL */}
            <div className="grid gap-6 lg:grid-cols-3 w-full min-w-0">
                {/* Left Column: Charts & Analytics */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl w-full min-w-0 overflow-hidden">
                        <CardHeader className="px-5 pt-5 pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Engagement Overview</CardTitle>
                                    <CardDescription className="text-xs">Your profile performance over the last 7 days.</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-[#F26522]/10 text-[#F26522] border-none font-bold">
                                    +12% this week
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="mt-4">
                                <ActivityAreaChart data={mockActivityData} height={320} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions (Moved below chart for better flow) */}
                    <Card className="border-none shadow-sm bg-white/60 rounded-2xl">
                        <CardHeader className="px-5 pt-5 pb-3">
                            <CardTitle className="text-sm">Action Items</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {missingFields.length > 0 ? (
                                    missingFields.slice(0, 3).map((field, index) => (
                                        <a
                                            key={index}
                                            href="/profile"
                                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white hover:shadow-md transition-all group border border-transparent hover:border-[#F26522]/20 text-center gap-2"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-[#F26522]/10 flex items-center justify-center group-hover:bg-[#F26522] transition-colors shrink-0">
                                                <ArrowUpRight className="h-5 w-5 text-[#F26522] group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold capitalize text-[#1A1A2E]">
                                                    Add {field}
                                                </p>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-6 text-center space-y-2">
                                        <div className="bg-emerald-500/10 p-3 rounded-full mb-2">
                                            <Sparkles className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <p className="text-sm font-bold text-[#1A1A2E]">You&apos;re all set!</p>
                                        <p className="text-xs text-[#1A1A2E]/40">Your profile is 100% complete.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Sidebar Tasks & Activities */}
                <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl flex-1 flex flex-col min-h-[400px]">
                        <CardHeader className="px-5 pt-5 pb-4 border-b border-[#1A1A2E]/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#F26522]" />
                                    Recent Activity
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-0 py-2 flex-1 overflow-y-auto">
                            <div className="flex flex-col">
                                {activities.length > 0 ? (
                                    activities.map((activity, idx) => (
                                        <div
                                            key={activity.id}
                                            className={cn(
                                                "flex items-start gap-3 p-4 hover:bg-[#1A1A2E]/5 transition-colors relative group",
                                                idx !== activities.length - 1 && "border-b border-[#1A1A2E]/5"
                                            )}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/5 flex items-center justify-center shrink-0 mt-0.5">
                                                <Clock className="w-3.5 h-3.5 text-[#1A1A2E]/40" />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <p className="text-xs font-semibold text-[#1A1A2E] leading-relaxed pr-2">
                                                    {activity.message}
                                                </p>
                                                <p className="text-[10px] font-medium text-[#1A1A2E]/40 mt-1">
                                                    {formatDistanceToNow(new Date(activity.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-[#1A1A2E]/40 text-xs font-medium px-4">
                                        No recent activity to show right now.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
