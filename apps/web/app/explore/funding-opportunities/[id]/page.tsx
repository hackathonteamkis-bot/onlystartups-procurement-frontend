export const dynamic = "force-dynamic";

import { getGrantById } from "@/actions/explore";
import {
  ArrowLeft,
  Calendar,
  Info,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge, Separator } from "@onlystartups/ui";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";

interface GrantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GrantDetailPage({
  params,
}: GrantDetailPageProps) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const { id } = await params;
  const res = await getGrantById(id);

  if ("error" in res) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <Sparkles className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold">Funding Opportunity not found</h2>
        <Link
          href="/explore"
          className="text-[#F26522] hover:underline font-semibold"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  const opportunity = res;
  const isClosed = opportunity.deadline && new Date(opportunity.deadline) < new Date();
  
  const formatDate = (date: string | null) => {
    if (!date) return "TBD";
    const dateStr = new Date(date).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      weekday: "long"
    });
    return `${dateStr}, 11:59 PM IST`;
  };

  const hashtags = opportunity.hashtags ? opportunity.hashtags.split(' ').filter((t: string) => t.trim()) : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-0 pb-20 overflow-x-hidden sm:overflow-x-visible">
      
      {/* Nav */}
      <div className="hidden md:flex">
        <Link
          href="/explore"
          className="text-xs font-bold text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO DIRECTORY
        </Link>
      </div>

      {/* Mobile Thumbnail (Top) */}
      <div className="block md:hidden aspect-[4/5] rounded-none sm:rounded-2xl overflow-hidden relative -mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full">
        {opportunity.image ? (
          <Image src={opportunity.image} alt={opportunity.name} fill className="object-contain" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <Sparkles className="w-16 h-16 text-[#F26522]/40" />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-2 md:mt-6">
        
        {/* Left Sidebar */}
        <div className="order-2 md:order-1 md:w-5/12 lg:w-4/12 xl:w-3/12 space-y-6">
          {/* Desktop Thumbnail */}
          <div className="hidden md:flex w-full aspect-[4/5] rounded-2xl overflow-hidden items-center justify-center relative">
            {opportunity.image ? (
              <Image src={opportunity.image} alt={opportunity.name} fill className="object-contain" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-[#F26522]/40" />
              </div>
            )}
          </div>
          
          {/* Startup Hub Info */}
          {opportunity.startupHub && (
            <div className="space-y-3">
               <h4 className="text-base sm:text-lg font-medium text-[#1A1A2E]">Presented By</h4>
               <Separator className="bg-black/10" />
               <div className="pt-1">
                  <div className="flex items-center gap-3 w-full group">
                    <Avatar className="h-10 w-10 rounded-lg shrink-0">
                      <AvatarImage src={opportunity.startupHub.image || ""} className="object-cover" />
                      <AvatarFallback className="bg-[#1A1A2E] text-white font-black text-xs">
                        {opportunity.startupHub.startupName?.charAt(0) || opportunity.startupHub.name?.charAt(0) || "SH"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A1A2E] whitespace-normal break-words">
                        {opportunity.startupHub.startupName || opportunity.startupHub.name}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Closes On */}
          <div className="space-y-3 pt-2">
             <h4 className="text-base sm:text-lg font-medium text-[#1A1A2E]">
               <span className="text-muted-foreground text-xs block uppercase tracking-widest font-black mb-1">Closes On</span>
               {formatDate(opportunity.deadline)}
             </h4>
             <Separator className="bg-black/10" />
          </div>
        </div>

        {/* Right Main Content */}
        <div className="order-1 md:order-2 md:w-7/12 lg:w-8/12 xl:w-9/12 space-y-8 md:pt-2">
          
          {/* Title & Badge */}
          <div className="space-y-4">
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag: string) => (
                  <Badge key={tag} className="bg-[#1A1A2E]/5 text-[#1A1A2E] border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-none">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A2E] tracking-tight leading-tight break-words hyphens-auto">
              {opportunity.name}
            </h1>
          </div>

          {/* Quick Info */}
          <div className="flex flex-col xl:flex-row gap-5 xl:gap-12 text-sm font-medium text-[#1A1A2E]">
             <div className="flex items-start gap-3 min-w-0">
               <Calendar className="w-4 h-4 text-[#1A1A2E] mt-0.5 shrink-0" />
               <div className="flex flex-col min-w-0">
                 <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-0.5">Application Deadline</span>
                 <span className="font-bold text-base break-words leading-tight">{formatDate(opportunity.deadline)}</span>
               </div>
             </div>
          </div>

        {/* Application Box */}
          <section className="p-6 border border-black/15 rounded-2xl">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#1A1A2E] break-words">
                    {isClosed ? 'Applications Closed' : 'Open for Applications'}
                  </h2>
                </div>
                
                <div className="shrink-0 w-full sm:w-auto">
                  {isClosed ? (
                    <button
                      disabled
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold uppercase tracking-wide text-[10px] cursor-not-allowed text-center bg-muted text-muted-foreground"
                    >
                      Applications Closed
                    </button>
                  ) : (
                    <Link
                      href={isLoggedIn 
                        ? (opportunity.applyUrl || `/explore/funding-opportunities/${id}/apply`) 
                        : `/auth/login?callbackUrl=${encodeURIComponent(opportunity.applyUrl ? `/explore/funding-opportunities/${id}` : `/explore/funding-opportunities/${id}/apply`)}`}
                      target={isLoggedIn && opportunity.applyUrl ? "_blank" : undefined}
                      rel={isLoggedIn && opportunity.applyUrl ? "noreferrer" : undefined}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg font-black uppercase tracking-widest text-[10px] text-center transition-all bg-[#F26522] text-white hover:shadow-lg hover:shadow-[#F26522]/20 hover:opacity-90"
                    >
                      Apply Now {isLoggedIn && opportunity.applyUrl ? <ExternalLink className="w-3.5 h-3.5" /> : null}
                    </Link>
                  )}
                </div>
             </div>
          </section>

          {/* Text Content Sections */}
          <div className="space-y-6 pt-2">
            {/* Introduction */}
            {opportunity.introduction && (
              <section className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F26522]">Introduction</h3>
                <div className="prose prose-sm sm:prose-base max-w-none text-[#1A1A2E]/80 whitespace-pre-wrap break-words">
                  {opportunity.introduction}
                </div>
              </section>
            )}

            {/* Key Highlights */}
            {opportunity.keyHighlights && (
              <section className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F26522]">Key Highlights</h3>
                <div className="prose prose-sm sm:prose-base max-w-none text-[#1A1A2E]/80 whitespace-pre-wrap break-words">
                  {opportunity.keyHighlights}
                </div>
              </section>
            )}

            {/* Closing Statement */}
            {opportunity.closingStatement && (
              <section className="space-y-3">
                 <p className="text-[#1A1A2E] font-bold text-sm sm:text-base leading-relaxed break-words">
                   {opportunity.closingStatement}
                 </p>
              </section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
