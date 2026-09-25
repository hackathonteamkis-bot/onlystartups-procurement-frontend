export const dynamic = "force-dynamic";
import { getExploreData } from "@/actions/explore";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  Badge,
} from "@onlystartups/ui";
import { 
  Building2, 
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

export default async function ExploreFundingOpportunitiesPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const data = await getExploreData();
  
  if ("error" in data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#1A1A2E]/60">{data.error}</p>
      </div>
    );
  }

  const fundingOpportunities = data.fundingOpportunities || [];

  const formatDate = (date: string | null) => {
    if (!date) return "TBD";
    const dateStr = new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateStr}, 11:59 PM IST`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <Link
          href="/explore"
          className="text-xs font-bold text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors uppercase tracking-widest w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Explore
        </Link>
        <PageHeader
          title="Funding Opportunities"
          description="Find seed funds and capital to scale your startup."
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F26522]/5 rounded-full border border-[#F26522]/10 shrink-0">
            <Badge variant="outline" className="bg-[#F26522] text-white border-none px-2 py-0.5 text-[10px] font-black uppercase">Live</Badge>
            <span className="text-[10px] font-black text-[#1A1A2E] tracking-widest uppercase">{fundingOpportunities.length} Active Opportunities</span>
          </div>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fundingOpportunities.length > 0 ? (
          fundingOpportunities.map((opportunity: any) => {
            const isClosed = opportunity.deadline && new Date(opportunity.deadline) < new Date();

            return (
              <div 
                key={opportunity.id} 
                className="bg-white border border-muted/40 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col relative"
              >
                {/* Status Badge */}
                <Badge className={`absolute top-3 left-3 z-10 text-white border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm ${
                  isClosed ? 'bg-gray-500' : 'bg-[#00B87C]'
                }`}>
                  {isClosed ? 'Closed' : 'Active'}
                </Badge>

                {/* Thumbnail */}
                <div className="w-full aspect-[4/3] relative bg-[#F5F5EE]/30 border-b border-muted/20 overflow-hidden">
                  {opportunity.image ? (
                    <Image src={opportunity.image} alt={opportunity.name || "Opportunity"} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E]/5 to-[#2B2B3E]/10 flex items-center justify-center">
                      <span className="text-[#1A1A2E]/20 font-black text-6xl">{(opportunity.name || "F").charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col items-start text-left space-y-4">
                    <h4 className="text-base font-bold text-[#1A1A2E] tracking-tight group-hover:text-[#F26522] transition-colors line-clamp-2">
                      {opportunity.name}
                    </h4>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg border border-muted/40 overflow-hidden relative bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                        {opportunity.govDepartment?.image ? (
                          <Image src={opportunity.govDepartment.image} alt={opportunity.govDepartment.name} fill className="object-cover" />
                        ) : (
                          <Building2 className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-black text-[#1A1A2E]/40 uppercase tracking-tighter mb-0.5">Managed By</p>
                        <p className="text-xs font-bold text-[#1A1A2E] truncate">
                          {opportunity.govDepartment?.startupName || opportunity.govDepartment?.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-left pt-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Closes on:</p>
                      <p className="text-xs font-medium text-[#1A1A2E]">
                        {formatDate(opportunity.deadline)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 sm:gap-3">
                    <Link
                      href={`/explore/funding-opportunities/${opportunity.id}`}
                      className="flex-1 py-2 sm:py-2.5 border-2 border-muted/60 text-[10px] sm:text-xs font-bold rounded-lg text-[#1A1A2E] hover:border-[#1A1A2E] transition-all text-center"
                    >
                      View details
                    </Link>
                    
                    {isClosed ? (
                      <button
                        disabled
                        className="flex-1 py-2 sm:py-2.5 bg-muted text-muted-foreground text-[10px] sm:text-xs font-bold rounded-lg cursor-not-allowed text-center"
                      >
                        Applications Closed
                      </button>
                    ) : (
                      <Link
                        href={isLoggedIn 
                          ? (opportunity.applyUrl || `/explore/funding-opportunities/${opportunity.id}/apply`) 
                          : `/auth/login?callbackUrl=${encodeURIComponent(opportunity.applyUrl ? `/explore/funding-opportunities` : `/explore/funding-opportunities/${opportunity.id}/apply`)}`}
                        target={isLoggedIn && opportunity.applyUrl ? "_blank" : undefined}
                        rel={isLoggedIn && opportunity.applyUrl ? "noreferrer" : undefined}
                        className="flex-1 py-2 sm:py-2.5 bg-[#F26522] text-white text-[10px] sm:text-xs font-bold rounded-lg hover:brightness-110 transition-all text-center shadow-sm"
                      >
                        Apply now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-[#1A1A2E]/10">
            <p className="text-muted-foreground font-medium text-sm">No funding opportunities available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
