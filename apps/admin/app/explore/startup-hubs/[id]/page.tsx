"use client";


import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getStartupHubById } from "@/actions/explore";
import { getPublicPrograms } from "@/actions/explore/apply";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Users,
  ShieldCheck,
  ExternalLink,
  Rocket,
  ArrowUpRight,
  Wallet,
  Users2,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Clock,
  Percent,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, useBreadcrumbContext } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import Link from "next/link";
import { toast } from "sonner";


import { trackAnalytics } from "@/actions/dashboard/analytics";

interface StartupHub {
  id: string;
  name: string;
  startupName?: string;
  title?: string;
  image?: string;
  bannerImage?: string;
  activeStartups?: string;
  totalExits?: string;
  fundingRaised?: string;
  mentorCount?: string;
  startupPhase?: string;
  websiteUrl?: string;
  linkedin?: string;
  startupDescription?: string;
  bio?: string;
  email?: string;
  networkSize?: string;
  startupHubQuote?: string;
  isApplied?: boolean;
  location?: string;
  sectors?: string[];
  programDuration?: string;
  equityTaken?: string;
  startupHubSocials?: Record<string, string>;
  applicationFormActive?: boolean;
}

const getPlatformIcon = (platform: string) => {
  const normalized = platform.toLowerCase();
  switch (normalized) {
    case "x":
    case "twitter":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "youtube":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-5.32 3.47h-3.008v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "discord":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
        </svg>
      );
    default:
      return <Globe className="w-4 h-4" />;
  }
};

const hasValue = (val: unknown): val is string => {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim().toLowerCase();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return false;
  // Reject protocol-only URLs
  if (trimmed === "https://" || trimmed === "http://") return false;
  return true;
};

export default function StartupHubDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setBreadcrumb } = useBreadcrumbContext();
  const [startupHub, setStartupHub] = useState<StartupHub | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasTrackedRef = useRef(false);

  const requireAuth = (e: React.MouseEvent, customMessage?: string) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.info(customMessage || "Please login to apply.");
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function fetchStartupHub() {
      try {
        setLoading(true);
        const data = await getStartupHubById(id as string);
        if (data) {
          setStartupHub(data);
          setBreadcrumb(id as string, data.startupName || data.name);
          
          const publicPrograms = await getPublicPrograms(id as string);
          if (Array.isArray(publicPrograms) && publicPrograms.length > 0) {
            setPrograms(publicPrograms);
          }

          const currentUserId = session?.user?.id;
          if (currentUserId && currentUserId !== id && !hasTrackedRef.current) {
            hasTrackedRef.current = true;
            void trackAnalytics("PROFILE_VIEW", "startupHub_profile", id as string);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStartupHub();
  }, [id, session?.user?.id, setBreadcrumb]);

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {/* Nav */}
        <Skeleton className="h-4 w-32" />

        {/* Header Banner Skeleton */}
        <div className="relative rounded-2xl overflow-hidden border border-muted/20 bg-white">
          <Skeleton className="h-36 sm:h-52 w-full" />
          <div className="px-6 pb-6 -mt-12 sm:-mt-16 flex flex-col md:flex-row gap-6 items-end relative z-10">
            <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl shrink-0 border-4 border-white" />
            <div className="flex-1 space-y-3 pb-2 w-full">
              <Skeleton className="h-8 w-48 sm:w-64" />
              <Skeleton className="h-4 w-32 sm:w-48" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-muted/50 p-5 rounded-2xl space-y-3"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!startupHub) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <Building2 className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold">Startup Hub not found</h2>
        <Link
          href="/explore/startup-hubs"
          className="text-primary hover:underline font-semibold"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  // Use real data, show nothing or " " if not filled
  const stats = [
    {
      label: "Active Startups",
      value: startupHub.activeStartups || " ",
      icon: Rocket,
    },
    {
      label: "Total Exits",
      value: startupHub.totalExits || " ",
      icon: ArrowUpRight,
    },
    {
      label: "Funding Raised",
      value: startupHub.fundingRaised ? `INR ${startupHub.fundingRaised}` : " ",
      icon: Wallet,
    },
    { label: "Mentors", value: startupHub.mentorCount || " ", icon: Users2 },
  ];

  const hasAnyStats =
    startupHub.activeStartups ||
    startupHub.totalExits ||
    startupHub.fundingRaised ||
    startupHub.mentorCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Nav */}
      <button
        onClick={() => router.back()}
        className="text-xs font-bold text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors uppercase tracking-widest w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Directory
      </button>

      {/* Header Banner & Profile Info Wrapper */}
      <div>
        {/* Header Banner Area */}
        <div className="relative rounded-2xl overflow-hidden border border-[#1A1A2E]/5 h-36 sm:h-52 w-full bg-gradient-to-r from-[#1A1A2E] via-[#2A2A44] to-[#F26522]/30 shadow-sm">
          {/* Cover image / gradient banner */}
          {startupHub.bannerImage && (
            <Image
              src={startupHub.bannerImage}
              alt="Cover Banner"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Header Info overlap */}
        <div className="px-4 sm:px-6 relative z-10 text-left">
          <div className="flex flex-row items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full border-4 border-[#F5F5EE] bg-white shadow-md shrink-0 -mt-4 sm:-mt-8">
              {startupHub.image && <AvatarImage src={startupHub.image} className="object-cover animate-in fade-in" />}
              <AvatarFallback className="text-2xl sm:text-4xl font-black bg-[#1A1A2E] text-white">
                {startupHub.startupName?.charAt(0) || startupHub.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pt-1 sm:pt-2 w-full">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 w-full">
                {/* Left side: Title, Location, Badges */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-start gap-1 sm:gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-3xl font-black text-[#1A1A2E] tracking-tight leading-tight sm:leading-none">
                      {startupHub.startupName || startupHub.name}
                    </h1>
                  </div>
                  {startupHub.location && (
                    <p className="text-sm sm:text-base text-muted-foreground font-semibold flex items-center justify-start gap-1 flex-wrap mt-0.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground/60 inline shrink-0" />
                      {startupHub.location}
                    </p>
                  )}
                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-start gap-2 pt-1 sm:pt-2">
                    {startupHub.startupPhase && (
                      <Badge className="bg-[#1A1A2E]/5 text-[#1A1A2E] border-none px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">
                        {startupHub.startupPhase} Phase
                      </Badge>
                    )}
                    {startupHub.sectors && startupHub.sectors.map((sector) => (
                      <Badge key={sector} className="bg-[#F26522]/10 text-[#F26522] border-none px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Grid Stats */}
      {hasAnyStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group bg-white border border-muted/50 p-5 rounded-2xl hover:shadow-md hover:border-[#1A1A2E]/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl font-black text-[#1A1A2E] mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Content */}
      <div className="flex flex-col gap-8 pb-20">
        {/* Active Programs */}
        {programs.length > 0 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1A1A2E] flex items-center gap-2 uppercase tracking-wider">
                <span className="w-1 h-4 bg-[#F26522] rounded-full" />
                Active Programs
              </h3>
              {programs.length > 3 && (
                <Link
                  href={`/explore/startup-hubs/${startupHub.id}/programs`}
                  className="text-xs font-bold text-primary hover:underline transition-colors"
                >
                  See more...
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program) => (
                <div key={program.id} className="bg-white border border-muted/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                  <div className="aspect-video w-full relative bg-muted/20">
                    {program.thumbnail ? (
                      <Image src={program.thumbnail} alt={program.name || "Program"} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] to-[#2B2B3E] flex items-center justify-center">
                        <span className="text-white font-black text-6xl opacity-30">{(program.name || "C").charAt(0)}</span>
                      </div>
                    )}
                    <Badge className={`absolute top-3 left-3 text-white border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm ${
                      program.status === 'INTAKE' ? 'bg-[#00B87C]' : 
                      program.status === 'ACTIVE' ? 'bg-[#1A1A2E]' : 
                      'bg-gray-500'
                    }`}>
                      {program.status === 'INTAKE' ? 'Active' : program.status === 'ACTIVE' ? 'Closed' : 'Completed'}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-[#1A1A2E] tracking-tight truncate">{program.name}</h4>
                      {program.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">{program.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={program.applyUrl || `/explore/startup-hubs/${startupHub.id}/programs/${program.id}/apply`}
                        onClick={(e) => {
                          requireAuth(e, "Please login to apply.");
                        }}
                        target={program.applyUrl ? "_blank" : undefined}
                        rel={program.applyUrl ? "noopener noreferrer" : undefined}
                        className="flex-1 h-9 bg-primary text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 flex items-center justify-center shadow-sm transition-all"
                      >
                        Apply
                      </Link>
                      <Link
                        href={`/explore/startup-hubs/${startupHub.id}/programs/${program.id}`}
                        className="flex-1 h-9 bg-muted/50 text-foreground rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Overview & Tagline */}
        {(startupHub.startupDescription || startupHub.bio || startupHub.startupHubQuote) && (
          <section className="bg-white border border-muted/50 p-6 sm:p-8 rounded-2xl space-y-8 shadow-sm">
            
            {startupHub.startupHubQuote && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-[#1A1A2E] flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-1 h-4 bg-[#F26522] rounded-full" />
                  Tagline
                </h3>
                <p className="text-base sm:text-lg text-black font-semibold leading-relaxed italic">
                  {startupHub.startupHubQuote}
                </p>
              </div>
            )}

            {(startupHub.startupDescription || startupHub.bio) && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-[#1A1A2E] flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-1 h-4 bg-[#F26522] rounded-full" />
                  Overview
                </h3>
                <p className="text-black leading-relaxed text-sm sm:text-base font-medium whitespace-pre-line">
                  {startupHub.startupDescription || startupHub.bio}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Empty state if no overview */}
        {!startupHub.startupDescription && !startupHub.bio && !startupHub.startupHubQuote && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 bg-muted/5 rounded-2xl border-2 border-dashed border-muted/30">
            <Building2 className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground font-semibold">
              This startup hub hasn&apos;t added an overview yet.
            </p>
          </div>
        )}

        {/* Sidebar Details */}
        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2B2B3E] text-white p-6 sm:p-8 rounded-2xl space-y-6 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />

          <h4 className="text-base font-black uppercase tracking-wider border-b border-white/10 pb-4">
            Startup Hub Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
            {startupHub.email && (
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#F26522] group-hover:bg-[#F26522]/10 transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Contact
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white/95 break-all hover:text-white transition-colors">
                    {startupHub.email}
                  </p>
                </div>
              </div>
            )}
            {startupHub.location && (
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#F26522] group-hover:bg-[#F26522]/10 transition-colors shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Location
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">{startupHub.location}</p>
                </div>
              </div>
            )}
            {startupHub.programDuration && (
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#F26522] group-hover:bg-[#F26522]/10 transition-colors shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Duration
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">{startupHub.programDuration}</p>
                </div>
              </div>
            )}
            {startupHub.equityTaken && (
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#F26522] group-hover:bg-[#F26522]/10 transition-colors shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Equity Taken
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">{startupHub.equityTaken}</p>
                </div>
              </div>
            )}
            {startupHub.networkSize && (
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#F26522] group-hover:bg-[#F26522]/10 transition-colors shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Network size
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">
                    {startupHub.networkSize} Members
                  </p>
                </div>
              </div>
            )}
          </div>

          {startupHub.startupHubSocials && Object.entries(startupHub.startupHubSocials).filter(([, url]) => hasValue(url)).length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-3">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                Social Channels
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(startupHub.startupHubSocials)
                  .filter(([, url]) => hasValue(url))
                  .map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url.startsWith("http") ? url : `https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={platform.toUpperCase()}
                      className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                    >
                      {getPlatformIcon(platform)}
                    </a>
                  ))}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
