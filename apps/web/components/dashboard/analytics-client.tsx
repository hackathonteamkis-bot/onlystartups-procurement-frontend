"use client";

import { useMemo } from "react";
import {
    TrendingUp,
    Users,
    Calendar,
    Eye,
    CheckCircle2,
    Activity,
    ChevronRight,

} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@onlystartups/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@onlystartups/ui";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@onlystartups/ui";

interface AnalyticsClientProps {
    initialStats: { type: string; key: string; createdAt: string }[];
    initialDailyStats?: any[];
    initialEventStats: { id: string; title: string; views: number; submits: number; conversion: number }[];
}

export function AnalyticsClient({
    initialStats,
    initialDailyStats,
    initialEventStats
}: AnalyticsClientProps) {
    // Computed Stats
    const summary = useMemo(() => {
        const totalHits = initialStats.length;
        const startupHubSubmits = initialStats.filter(s => s.type === "FORM_SUBMIT" && s.key === "startupHub_form").length;
        const opportunitySubmits = initialStats.filter(s => s.type === "FORM_SUBMIT" && s.key === "funding_opportunity").length;
        const profileViews = initialStats.filter(s => s.type === "PROFILE_VIEW").length;

        return { totalHits, startupHubSubmits, opportunitySubmits, profileViews };
    }, [initialStats]);

    const getViewsByKey = (key: string) => initialStats.filter(s => s.key === key && s.type === "FORM_VIEW").length;
    const getSubmitsByKey = (key: string) => initialStats.filter(s => s.key === key && s.type === "FORM_SUBMIT").length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="Conversion Intelligence"
                    description="Real-time data on your ecosystem growth and founder engagement."
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    <Activity className="w-3 h-3 animate-pulse" />
                    Live Engine Active
                </div>
            </div>

            {/* Top Summary Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Funnel Hits", value: summary.totalHits, prefix: "" },
                    { label: "StartupHub Submits", value: summary.startupHubSubmits, prefix: "" },
                    { label: "Funding Opportunities", value: summary.opportunitySubmits, prefix: "" },
                    { label: "Profile Reach", value: summary.profileViews, prefix: "" },
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-all group">
                        <CardContent className="p-4 sm:p-6">
                            <p className="text-[10px] font-black text-[#1A1A2E]/40 uppercase tracking-[0.2em] truncate">{item.label}</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">{item.value}</h3>
                                {item.prefix && <span className="text-xs font-bold text-[#1A1A2E]/30">{item.prefix}</span>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="insights" className="w-full">
                <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-xl h-auto border border-[#1A1A2E]/5 overflow-x-auto flex-nowrap md:flex-wrap mb-8">
                    <TabsTrigger value="insights" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-xl font-black text-[10px] uppercase tracking-widest transition-all">
                        Insights
                    </TabsTrigger>
                    <TabsTrigger value="events" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-xl font-black text-[10px] uppercase tracking-widest transition-all">
                        Events
                    </TabsTrigger>
                    <TabsTrigger value="grants" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-xl font-black text-[10px] uppercase tracking-widest transition-all">
                        Grants Scheme
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                    <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="p-6 sm:p-8 border-b border-[#1A1A2E]/5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg sm:text-xl">Event Performance</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm truncate">Metrics tracked for each of your organized events.</CardDescription>
                                </div>
                                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#1A1A2E]/5 shrink-0" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {initialEventStats.length === 0 ? (
                                <div className="p-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-[#1A1A2E]/5 rounded-full flex items-center justify-center mx-auto">
                                        <Calendar className="w-6 h-6 text-[#1A1A2E]/20" />
                                    </div>
                                    <p className="text-sm font-bold text-[#1A1A2E]/40 uppercase tracking-widest italic">No organized events to track.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#1A1A2E]/5">
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/40">Event Subject</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/40">Reach</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/40">Applicants</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/40">Con. Rate</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/40 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#1A1A2E]/5">
                                            {initialEventStats.map((e, i) => (
                                                <tr key={i} className="hover:bg-[#1A1A2E]/5 transition-colors group">
                                                    <td className="px-8 py-6 font-bold text-[#1A1A2E]">{e.title}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                                                            <span className="font-black text-sm">{e.views}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-3.5 h-3.5 text-[#F26522]" />
                                                            <span className="font-black text-sm">{e.submits}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px]">
                                                            {e.conversion}%
                                                        </Badge>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => (window.location.href = `/startup-hub/applications?type=meetup&id=${e.id}`)}
                                                            className="p-3 rounded-xl bg-[#1A1A2E]/5 hover:bg-[#1A1A2E] hover:text-white transition-all"
                                                        >
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insights">
                    <div className="space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <Card className="border-none shadow-xl bg-white rounded-2xl p-6 sm:p-8 space-y-6 sm:space-y-8">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-[#1A1A2E]">Funnel Visualization</h3>
                                    <p className="text-xs sm:text-sm text-[#1A1A2E]/50 font-medium">Conversion flow from direct links to submission.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Stage 1: Views */}
                                    <div className="p-4 sm:p-6 rounded-xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                                                <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Interest</p>
                                                <p className="text-base sm:text-lg font-black text-[#1A1A2E]">Link Hits</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">{getViewsByKey("startupHub_form")}</p>
                                            <p className="text-[9px] sm:text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Initial Profile Context</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center -my-2 relative z-10">
                                        <div className="h-6 sm:h-8 w-px bg-gradient-to-b from-blue-500 to-[#F26522] border-l-2 border-dashed opacity-20" />
                                    </div>

                                    {/* Stage 2: Submits */}
                                    <div className="p-4 sm:p-6 rounded-xl bg-orange-50 border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F26522] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
                                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] sm:text-[10px] font-black text-[#F26522] uppercase tracking-[0.2em]">Commit</p>
                                                <p className="text-base sm:text-lg font-black text-[#1A1A2E]">Form Recieved</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">{getSubmitsByKey("startupHub_form")}</p>
                                            <p className="text-[9px] sm:text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Converted Leads</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex flex-col gap-6">
                                <Card className="border-none shadow-xl bg-[#F26522] text-white p-6 sm:p-10 rounded-2xl flex-1 flex flex-col justify-center">
                                    <h4 className="text-[10px] sm:text-sm font-black uppercase tracking-[0.3em] opacity-60 mb-4">Master Conversion</h4>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-5xl sm:text-7xl font-black">
                                            {getViewsByKey("startupHub_form") > 0
                                                ? ((getSubmitsByKey("startupHub_form") / getViewsByKey("startupHub_form")) * 100).toFixed(1)
                                                : "0"}
                                        </h3>
                                        <span className="text-xl sm:text-2xl font-black opacity-40">%</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs font-bold mt-6 leading-relaxed opacity-70">
                                        Efficiency of your primary funnel.
                                    </p>
                                </Card>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Card className="border-none shadow-sm bg-white p-6 rounded-xl">
                                        <p className="text-[10px] font-black text-[#1A1A2E]/40 uppercase tracking-widest">Link Pops</p>
                                        <p className="text-lg sm:text-xl font-black text-[#1A1A2E] mt-1">
                                            {initialStats.filter(s => s.key === "startupHub_form" && s.type === "LINK_TAP").length}
                                        </p>
                                    </Card>
                                    <Card className="border-none shadow-sm bg-white p-6 rounded-xl">
                                        <p className="text-[10px] font-black text-[#1A1A2E]/40 uppercase tracking-widest">QR Syncs</p>
                                        <p className="text-lg sm:text-xl font-black text-[#1A1A2E] mt-1">
                                            {initialStats.filter(s => s.key === "startupHub_form" && s.type === "QR_DOWNLOAD").length}
                                        </p>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <Card className="border-none shadow-xl bg-white rounded-2xl px-8 py-4 sm:px-10 sm:py-6 overflow-hidden relative">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

                            <div className="relative z-10 flex flex-row items-center justify-between">
                                <h3 className="text-[80px] sm:text-[100px] font-black text-[#1A1A2E] leading-none tracking-tighter">
                                    {summary.profileViews}
                                </h3>
                                <div className="text-right max-w-xs">
                                    <h3 className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight">Profile Reach Access</h3>
                                    <p className="text-xs text-[#1A1A2E]/50 font-medium mt-2">
                                        Total unique visits recorded for your startupHub profile.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="grants">
                    <Card className="border-none shadow-xl bg-white rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                            <div>
                                <h3 className="text-2xl font-black text-[#1A1A2E]">Grant Performance</h3>
                                <p className="text-sm text-[#1A1A2E]/50 font-medium">Submissions tracked across your funding opportunities.</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-600 border-none px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                                {initialStats.filter(s => s.type === "FORM_SUBMIT" && s.key === "funding_opportunity").length} Active Applications
                            </Badge>
                        </div>

                        <div className="grid gap-4">
                            {initialStats.filter(s => s.type === "FORM_SUBMIT" && s.key === "funding_opportunity").length === 0 ? (
                                <div className="p-20 border-2 border-dashed border-[#1A1A2E]/5 rounded-2xl text-center italic text-[#1A1A2E]/30 font-bold">
                                    No grant applications yet.
                                </div>
                            ) : (
                                initialStats.filter(s => s.type === "FORM_SUBMIT" && s.key === "funding_opportunity").slice(0, 10).map((s, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-xl bg-[#F5F5EE]/50 border border-[#1A1A2E]/5 hover:border-[#1A1A2E]/20 transition-all gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1A1A2E] truncate max-w-[200px] sm:max-w-none">General Funding Opportunity Application</p>
                                                <p className="text-[10px] font-black text-[#1A1A2E]/30 uppercase tracking-widest">
                                                    {new Date(s.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white font-black text-[10px] uppercase px-4 py-1.5 rounded-full border-none self-start sm:self-center">
                                            Recieved
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    );
}
