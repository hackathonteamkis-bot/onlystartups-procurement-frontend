"use client";

import { useSession } from "next-auth/react";
import {
    Users,
    Sparkles,
    ArrowUpRight,
    Rocket,
    Clock,
    Activity,
    Shield,
    Settings,
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
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { cn } from "@/lib/utils";

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

        // Stats updates removed

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

    // Removed missingFields logic as it is not needed for admin dashboard

    if (session?.user?.role === "STARTUP_HUB") {
        return <StartupHubDashboard initialData={stats as any} />;
    }

    if (session?.user?.role === "ADMIN") {
        return <AdminDashboard />;
    }

    return (
        <div className="w-full min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Hero Header */}
            <div className="relative overflow-hidden bg-[#1A1A2E] text-white rounded-2xl p-6 sm:p-8 sm:py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-xl">
                

                <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-6 relative z-10 w-full">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white/20 shadow-2xl shrink-0">
                        <AvatarImage src={liveUser?.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-[#F26522] text-white text-2xl sm:text-3xl font-black">
                            {liveUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                                {getGreeting()}, {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim()?.split(" ")[0] || "Founder"}!
                            </h1>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 text-white/60 text-sm font-medium">
                            <p>{currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* Main Content Areas */}
            <div className="grid gap-6 lg:grid-cols-3 w-full min-w-0">
                <Card className="lg:col-span-2 py-4 sm:py-6 gap-4 sm:gap-6 border-[#1A1A2E]/5 bg-white/40 rounded-2xl w-full min-w-0 overflow-hidden">
                    <CardHeader className="px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Clock className="w-4 h-4 text-[#1A1A2E]/30" />
                        </div>
                        <CardDescription>
                            Latest system events and platform updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <div className="flex flex-col space-y-4">
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center space-x-4 p-3 rounded-lg bg-white/20 hover:bg-white/40 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A2E]/30 shrink-0 ml-1" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium break-words">
                                                {activity.message}
                                            </p>
                                            <p
                                                className="text-[#1A1A2E]/40"
                                                style={{ fontSize: "10px" }}
                                            >
                                                {formatDistanceToNow(new Date(activity.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-[#1A1A2E]/40 text-sm">
                                    No recent activity
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 py-4 sm:py-6 gap-4 sm:gap-6 border-[#1A1A2E]/5 bg-white/40 rounded-2xl w-full min-w-0 overflow-hidden">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Manage and configure platform settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <div className="flex flex-col space-y-3">
                            {[
                                {
                                    title: "Review Hub Requests",
                                    description: "Manage pending applications",
                                    href: "/admin/hub-requests",
                                    icon: Shield,
                                    color: "text-blue-500",
                                    bg: "bg-blue-500/10",
                                    hoverBg: "group-hover:bg-blue-500/20",
                                    border: "hover:border-blue-500/20"
                                },
                                {
                                    title: "System Analytics",
                                    description: "Monitor platform metrics",
                                    href: "/dashboard",
                                    icon: Activity,
                                    color: "text-green-500",
                                    bg: "bg-green-500/10",
                                    hoverBg: "group-hover:bg-green-500/20",
                                    border: "hover:border-green-500/20"
                                },
                                {
                                    title: "Manage Users",
                                    description: "View and edit user accounts",
                                    href: "/dashboard",
                                    icon: Users,
                                    color: "text-purple-500",
                                    bg: "bg-purple-500/10",
                                    hoverBg: "group-hover:bg-purple-500/20",
                                    border: "hover:border-purple-500/20"
                                }
                            ].map((action, index) => (
                                <a
                                    key={index}
                                    href={action.href}
                                    className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-white/50 hover:bg-white transition-all group cursor-pointer border border-transparent ${action.border}`}
                                >
                                    <div className={`h-10 w-10 rounded-full ${action.bg} flex items-center justify-center ${action.hoverBg} transition-colors shrink-0`}>
                                        <action.icon className={`h-5 w-5 ${action.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold capitalize">
                                            {action.title}
                                        </p>
                                        <p className="text-xs text-[#1A1A2E]/40">
                                            {action.description}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
