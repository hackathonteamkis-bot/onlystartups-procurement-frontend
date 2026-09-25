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

interface AnalyticsSummaryProps {
    govDepartmentId: string;
    className?: string;
}

export function AnalyticsSummary({ govDepartmentId, className }: AnalyticsSummaryProps) {
    const [stats, setStats] = useState<{ type: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const res = await getAnalytics(govDepartmentId);
            if (Array.isArray(res)) {
                setStats(res);
            }
            setLoading(false);
        }
        loadStats();
    }, [govDepartmentId]);

    if (loading) {
        return (
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
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
        <Card className={cn("border-none shadow-xl bg-white/80 backdrop-blur-sm h-full flex flex-col", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Form Analytics</CardTitle>
                        <CardDescription>Track how many founders are scanning and clicking.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[#1A1A2E]/5 space-y-2">
                        <div className="text-[#1A1A2E]/40 font-bold uppercase text-[10px] tracking-widest">
                            Link Taps
                        </div>
                        <p className="text-2xl font-black text-[#1A1A2E]">{linkTaps}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A1A2E]/5 space-y-2">
                        <div className="text-[#1A1A2E]/40 font-bold uppercase text-[10px] tracking-widest">
                            Link Shared
                        </div>
                        <p className="text-2xl font-black text-[#1A1A2E]">{linkCopies}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A1A2E]/5 space-y-2">
                        <div className="text-[#1A1A2E]/40 font-bold uppercase text-[10px] tracking-widest">
                            QR Scans
                        </div>
                        <p className="text-2xl font-black text-[#1A1A2E]">{qrDownloads}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
