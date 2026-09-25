"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@onlystartups/ui";
import { getAnalytics } from "@/actions/dashboard/analytics";
import { Skeleton } from "@onlystartups/ui";
import { supabase } from "@/lib/supabase";
import { AnalyticsLineChart } from "@/components/dashboard/charts";
import { MousePointerClick, Share2, QrCode } from "lucide-react";

interface AnalyticsSummaryProps {
    startupHubId: string;
    className?: string;
}

const mockAnalyticsData = [
  { day: "Mon", scans: 2 },
  { day: "Tue", scans: 5 },
  { day: "Wed", scans: 3 },
  { day: "Thu", scans: 8 },
  { day: "Fri", scans: 12 },
  { day: "Sat", scans: 4 },
  { day: "Sun", scans: 9 },
];

export function AnalyticsSummary({ startupHubId, className }: AnalyticsSummaryProps) {
    const [stats, setStats] = useState<{ type: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const res = await getAnalytics(startupHubId);
            if (Array.isArray(res)) {
                setStats(res);
            }
            setLoading(false);
        }
        loadStats();

        const channel = supabase
            .channel(`analytics-${startupHubId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "analytics",
                    filter: `startupHub_id=eq.${startupHubId}`,
                },
                (payload) => {
                    setStats((prev) => [...prev, payload.new as { type: string }]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [startupHubId]);

    if (loading) {
        return (
            <Card className="border-none shadow-xl !bg-white/80 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                </CardContent>
            </Card>
        );
    }

    const linkTaps = stats.filter(s => s.type === "LINK_TAP").length;
    const linkCopies = stats.filter(s => s.type === "LINK_COPY").length;
    const qrDownloads = stats.filter(s => s.type === "QR_DOWNLOAD").length;

    return (
        <Card className={cn("border-none shadow-xl !bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-2xl", className)}>
            <CardHeader className="px-5 pt-5 pb-2 border-b border-[#1A1A2E]/5">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Form Analytics</CardTitle>
                        <CardDescription className="text-xs">Track how founders engage with your intake form.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 pt-5 pb-5">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-xl !bg-white/50 border border-slate-200/50 backdrop-blur-md shadow-sm space-y-1">
                        <div className="flex items-center gap-1.5">
                            <MousePointerClick className="w-3.5 h-3.5 text-[#F26522]" />
                            <span className="text-[#1A1A2E]/40 font-bold uppercase text-[9px] tracking-widest">Link Taps</span>
                        </div>
                        <p className="text-xl font-black text-[#1A1A2E]">{linkTaps}</p>
                    </div>

                    <div className="p-3 rounded-xl !bg-white/50 border border-slate-200/50 backdrop-blur-md shadow-sm space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[#1A1A2E]/40 font-bold uppercase text-[9px] tracking-widest">Link Shared</span>
                        </div>
                        <p className="text-xl font-black text-[#1A1A2E]">{linkCopies}</p>
                    </div>

                    <div className="p-3 rounded-xl !bg-white/50 border border-slate-200/50 backdrop-blur-md shadow-sm space-y-1">
                        <div className="flex items-center gap-1.5">
                            <QrCode className="w-3.5 h-3.5 text-purple-500" />
                            <span className="text-[#1A1A2E]/40 font-bold uppercase text-[9px] tracking-widest">QR Scans</span>
                        </div>
                        <p className="text-xl font-black text-[#1A1A2E]">{qrDownloads}</p>
                    </div>
                </div>

                {/* Graph */}
                <div className="pt-2">
                    <p className="text-xs font-bold text-[#1A1A2E] mb-3 px-1">Engagement (Last 7 Days)</p>
                    <AnalyticsLineChart data={mockAnalyticsData} height={200} />
                </div>
            </CardContent>
        </Card>
    );
}
