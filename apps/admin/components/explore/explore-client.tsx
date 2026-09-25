"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ArrowUpRight, ChevronRight, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Badge } from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ExploreItem {
  id: string;
  name?: string;
  startupName?: string;
  title?: string;
  image?: string;
  description?: string;
  startupDescription?: string;
  bio?: string;
  expertise?: string;
  type?: string;
  url?: string;
  applyUrl?: string;
  isApplied?: boolean;
  fundAmount?: string;
  date?: string;
  time?: string;
  location?: string;
  startupHubId?: string;
  startupHub?: {
    name?: string;
    startupName?: string;
    image?: string;
  };
  deadline?: string;
  applicationDeadline?: string;
  introduction?: string;
  keyHighlights?: string;
  hashtags?: string;
}

interface ExploreClientProps {
  initialData: {
    startupHubs: ExploreItem[];
    resources: ExploreItem[];
    events: ExploreItem[];
    fundingOpportunities: ExploreItem[];
    programs: ExploreItem[];
  };
}

export function ExploreClient({ initialData }: ExploreClientProps) {
  const startupHubs = initialData?.startupHubs || [];
  const resources = initialData?.resources || [];
  const events = initialData?.events || [];
  const fundingOpportunities = initialData?.fundingOpportunities || [];
  const programs = initialData?.programs || [];

  return (
    <div className="space-y-12 pb-20">
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {/* StartupHubs */}
          {startupHubs.length > 0 && (
            <motion.section
              key="startupHubs"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A2E]">Startup Hubs</h2>
                {startupHubs.length > 6 && (
                  <Link
                    href="/explore/startup-hubs"
                    className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    See More <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startupHubs.slice(0, 6).map((item: ExploreItem) => (
                  <CardMinimal key={item.id} item={item} type="startupHub" />
                ))}
              </div>
            </motion.section>
          )}

          {/* Funding Opportunities */}
          {fundingOpportunities.length > 0 && (
            <motion.section
              key="grants"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A2E]">
                  Funding Opportunities
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundingOpportunities.map((item: ExploreItem) => (
                  <CardMinimal key={item.id} item={item} type="grant" />
                ))}
              </div>
            </motion.section>
          )}

          {/* Programs */}
          {programs.length > 0 && (
            <motion.section
              key="programs"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A2E]">
                  Programs
                </h2>
                {programs.length > 6 && (
                  <Link
                    href="/explore/programs"
                    className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    See More <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((item: ExploreItem) => (
                  <CardMinimal key={item.id} item={item} type="program" />
                ))}
              </div>
            </motion.section>
          )}

          {/* Events */}
          {events.length > 0 && (
            <motion.section
              key="events"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A2E]">
                  Upcoming Events
                </h2>
                {events.length > 6 && (
                  <Link
                    href="/explore/events"
                    className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    See More <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 6).map((item: ExploreItem) => (
                  <CardMinimal key={item.id} item={item} type="event" />
                ))}
              </div>
            </motion.section>
          )}

          {/* Resources */}
          {resources.length > 0 && (
            <motion.section
              key="resources"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A2E]">Resources</h2>
                {resources.length > 8 && (
                  <Link
                    href="/explore/resources"
                    className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    See More <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {resources.slice(0, 8).map((item: ExploreItem) => (
                  <CardMinimal key={item.id} item={item} type="resource" />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* Empty State */}
      {startupHubs.length === 0 &&
        resources.length === 0 &&
        events.length === 0 &&
        fundingOpportunities.length === 0 &&
        programs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10 rounded-2xl border-2 border-dashed border-muted"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Search className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-[#1A1A2E]">No results found</h3>
              <p className="text-xs text-muted-foreground">
                The ecosystem directory is currently being indexed.
              </p>
            </div>
          </motion.div>
        )}
    </div>
  );
}

function CardMinimal({
  item,
  type,
}: {
  item: ExploreItem;
  type: "startupHub" | "mentor" | "resource" | "grant" | "event" | "program";
}) {
  const { status, data: session } = useSession();
  const router = useRouter();

  const rawDeadline = item.deadline || item.applicationDeadline;
  const isPastDeadline = rawDeadline ? new Date(rawDeadline) < new Date() : false;

  const requireAuth = (e: React.MouseEvent, customMessage?: string) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.info(customMessage || "Please login to apply or view details.");
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    return true;
  };
  if (type === "event") {
    return (
      <motion.div
        layout
        whileHover={{ y: -4 }}
        className="group relative bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col h-full cursor-pointer"
        onClick={() => {
          router.push(`/explore/events/${item.id}`);
        }}
      >
        {/* Event Cover Image Banner */}
        {item.image ? (
          <div className="w-full aspect-video bg-gray-100 relative shrink-0">
            <Image src={item.image} alt={item.title || item.name || ''} fill unoptimized className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center shrink-0 border-b border-gray-100">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col space-y-3">
          {/* Title and Host */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1A1A2E] leading-tight line-clamp-2 break-words">
              {item.title || item.name}
            </h3>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              By {item.startupHub?.startupName || item.startupHub?.name}
            </p>
          </div>

          {/* Date / Time */}
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mt-auto pt-3 border-t border-muted/20">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
              {item.date ? new Date(item.date).toLocaleDateString() : "Date TBD"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/70" /> {item.time || "Time TBD"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "grant") {
    return (
      <motion.div
        layout
        whileHover={{ y: -4 }}
        className="group relative bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl p-4 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col h-full"
      >
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10 rounded-lg border border-muted-foreground/10 bg-muted/10 shrink-0">
            {item.startupHub?.image && <AvatarImage src={item.startupHub.image as string} className="object-cover" />}
            <AvatarFallback className="text-xs font-bold bg-[#1A1A2E] text-white">
              {(item.startupHub?.startupName || item.startupHub?.name || "?").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-[#1A1A2E] truncate group-hover:text-primary transition-colors leading-tight">
              {item.name || item.title}
            </h3>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-1 truncate">
              By {item.startupHub?.startupName || item.startupHub?.name}
            </p>
          </div>
        </div>

        {item.fundAmount && (
          <div className="mb-3">
            <span className="text-lg font-black text-emerald-600">{item.fundAmount}</span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest ml-1.5">Funding</span>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {item.description || item.introduction || item.keyHighlights || "No description provided."}
          </p>
          {item.hashtags && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.hashtags.split(/[#,\s]+/).map((tag) => tag.trim()).filter(Boolean).slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5 font-medium rounded-md bg-muted/80 text-foreground border-none">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-muted/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            {item.deadline ? new Date(item.deadline).toLocaleDateString() : "Rolling"}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/explore/funding-opportunities/${item.id}`}
              className="px-3 py-1.5 bg-muted/50 text-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-colors flex items-center justify-center"
            >
              Details
            </Link>
            {item.isApplied ? (
              <button
                disabled
                className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-default border border-emerald-500/20 flex items-center justify-center"
              >
                Applied
              </button>
            ) : isPastDeadline ? (
              <button
                disabled
                className="px-4 py-1.5 bg-muted/50 text-muted-foreground rounded-lg text-[10px] font-black uppercase tracking-wider cursor-default border border-muted/20 flex items-center justify-center"
              >
                Closed
              </button>
            ) : (
              <Link
                href={item.applyUrl || `/explore/funding-opportunities/${item.id}/apply`}
                onClick={(e) => {
                  requireAuth(e, "Please login to apply.");
                }}
                target={item.applyUrl ? "_blank" : undefined}
                rel={item.applyUrl ? "noopener noreferrer" : undefined}
                className="px-4 py-1.5 bg-[#1A1A2E] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-primary transition-colors flex items-center justify-center"
              >
                Apply
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl p-4 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col h-full"
    >
      {/* Header: Logo + Title */}
      <div className="flex items-center gap-3">
        {type !== "resource" && (
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 rounded-lg border border-muted-foreground/5 bg-muted/10">
              {(item.image || item.startupHub?.image) && <AvatarImage src={(item.image || item.startupHub?.image) as string} className="object-cover" />}
              <AvatarFallback className="text-[10px] font-bold bg-[#1A1A2E] text-white">
                {(item.startupName || item.name || item.title || "?").charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div
          className={cn(
            "min-w-0",
            (type === "resource") && "flex-1",
          )}
        >
          <h3 className="text-sm font-bold text-[#1A1A2E] truncate group-hover:text-primary transition-colors leading-none">
            {item.startupName || item.name || item.title}
          </h3>
          {type === "mentor" && (
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1 truncate">
              {item.expertise}
            </p>
          )}
          {type === "resource" && (
            <Badge
              variant="secondary"
              className="mt-1 h-4 px-1 text-[8px] font-black uppercase rounded-sm border-none bg-muted/50 text-muted-foreground"
            >
              {item.type}
            </Badge>
          )}
          {type === "program" && (
            <div className="mt-1 flex items-center gap-1.5">
              <Badge className="h-4 px-1 text-[8px] font-black uppercase rounded-sm border-none bg-purple-100 text-purple-600">
                Program
              </Badge>
              <span className="text-[9px] text-muted-foreground font-medium">
                by {item.startupHub?.startupName || item.startupHub?.name}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Description */}
      <div className="mt-3 flex-1 overflow-hidden">
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {item.description ||
            item.startupDescription ||
            item.bio ||
            item.expertise ||
            "Discover more details, insights, and opportunities by viewing the complete profile."}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {type === "startupHub" || type === "program" ? (
          <>
            {type !== "startupHub" && (
              item.isApplied ? (
                <button
                  disabled
                  className="flex-1 h-8 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-default border border-emerald-500/20"
                >
                  Applied
                </button>
              ) : isPastDeadline ? (
                <button
                  disabled
                  className="flex-1 h-8 bg-muted/50 text-muted-foreground rounded-lg text-[10px] font-black uppercase tracking-wider cursor-default border border-muted/20"
                >
                  Closed
                </button>
              ) : (
                <Link
                  href={item.applyUrl || `/explore/startup-hubs/${item.startupHubId}/programs/${item.id}/apply`}
                  onClick={(e) => {
                    requireAuth(e, "Please login to apply.");
                  }}
                  target={item.applyUrl ? "_blank" : undefined}
                  rel={item.applyUrl ? "noopener noreferrer" : undefined}
                  className="flex-1 h-8 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider hover:brightness-110 flex items-center justify-center"
                >
                  Apply
                </Link>
              )
            )}
            <Link
              href={
                type === "startupHub"
                  ? `/explore/startup-hubs/${item.id}`
                  : type === "program"
                    ? `/explore/startup-hubs/${item.startupHubId}/programs/${item.id}`
                    : `/explore/events/${item.id}`
              }
              className="flex-1 h-8 bg-muted/50 text-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-all flex items-center justify-center"
            >
              Details
            </Link>
          </>
        ) : type === "resource" ? (
          <Link
            href={`/explore/resources/${item.id}`}
            className="w-full h-8 flex items-center justify-center gap-2 bg-muted/30 text-muted-foreground hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all group/btn"
          >
            View
            <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        ) : (
          <button 
            onClick={(e) => requireAuth(e, "Please login to request a session.")}
            className="w-full h-8 flex items-center justify-center gap-2 bg-muted/30 text-muted-foreground hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all group/btn"
          >
            Request Session
            <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
