"use client";
import { useCallback } from 'react';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getMeetupById, registerForMeetup } from "@/actions/events";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Info,
  ArrowUpRight,
  FileText,
  MapPinned
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge, Separator } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { trackAnalytics } from "@/actions/dashboard/analytics";

interface Meetup {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  format?: string;
  tags?: string[];
  speakers?: any;
  agenda?: any;
  image?: string;
  maxAttendees?: number;
  govDepartmentId: string;
  isApplied?: boolean;
  registrationStatus?: string;
  govDepartment: {
    name: string;
    startupName?: string;
    image?: string;
    bio?: string;
    startupDescription?: string;
  };
  _count?: {
    registrations: number;
  };
}

export default function MeetupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const hasTrackedRef = useRef(false);

  

  const fetchMeetup = useCallback(async (shouldTrack = false) => {
    try {
      if (typeof params.id === "string") {
        const res = await getMeetupById(params.id);
        if ("error" in res) {
          toast.error(res.error);
        } else {
          setMeetup(res);
          const currentUserId = session?.user?.id;
          if (shouldTrack && res.govDepartmentId && currentUserId && currentUserId !== res.govDepartmentId && !hasTrackedRef.current) {
            hasTrackedRef.current = true;
            void trackAnalytics("FORM_VIEW", "meetup", res.govDepartmentId, { meetupId: res.id });
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  }, [params.id, session]);

  useEffect(() => {
    if (params.id && status !== "loading") {
       fetchMeetup(true);
    }
  }, [params.id, status, session?.user?.id, fetchMeetup]);

  const handleRegister = async () => {
    if (!meetup) return;
    if (status === "unauthenticated") {
      toast.info("Please login to register for this event.");
      window.location.href = "/auth/login";
      return;
    }
    
    setIsRegistering(true);
    try {
      const res = await registerForMeetup(meetup.id);
      if (res && res.id) {
        toast.success("Successfully registered for the event!");
        fetchMeetup();

        void trackAnalytics("FORM_SUBMIT", "meetup", meetup.govDepartmentId, { meetupId: meetup.id });
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An unexpected response was received.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during registration");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!meetup) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <MapPinned className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold">Briefing/Workshop not found</h2>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline font-semibold"
        >
          Back to Briefings & Workshops
        </button>
      </div>
    );
  }

  const isFull =
    !!meetup.maxAttendees &&
    (meetup._count?.registrations || 0) >= meetup.maxAttendees;

  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      weekday: "long"
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-0 pb-20 overflow-x-hidden sm:overflow-x-visible">
      
      {/* Nav */}
      <div className="hidden md:flex">
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO BRIEFINGS & WORKSHOPS
        </button>
      </div>

      {/* Mobile Thumbnail (Top) */}
      <div className="block md:hidden aspect-video rounded-none sm:rounded-2xl overflow-hidden bg-[#F5F5EE]/30 relative -mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full border-b border-muted/20">
        {meetup.image ? (
          <Image src={meetup.image} alt={meetup.title} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <Calendar className="w-16 h-16 text-[#F26522]/40" />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-2 md:mt-6">
        
        {/* Left Sidebar */}
        <div className="order-2 md:order-1 md:w-5/12 lg:w-4/12 xl:w-3/12 space-y-6">
          {/* Desktop Thumbnail */}
          <div className="hidden md:flex w-full aspect-video rounded-2xl overflow-hidden bg-[#F5F5EE]/30 items-center justify-center border border-muted/50 relative">
            {meetup.image ? (
              <Image src={meetup.image} alt={meetup.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Calendar className="w-20 h-20 text-[#F26522]/40" />
              </div>
            )}
          </div>
          
          {/* Startup Hub Info */}
          <div className="space-y-3">
             <h4 className="text-base sm:text-lg font-medium text-[#1A1A2E]">Presented By</h4>
             <Separator className="bg-black/10" />
             <div className="pt-1">
                <Link 
                  href={`/explore/gov-departments/${meetup.govDepartmentId}`}
                  className="flex items-center gap-3 w-full group"
                >
                  <Avatar className="h-10 w-10 rounded-lg shrink-0 group-hover:opacity-80 transition-opacity">
                    <AvatarImage src={meetup.govDepartment?.image || ""} className="object-cover" />
                    <AvatarFallback className="bg-[#1A1A2E] text-white font-black text-xs">
                      {meetup.govDepartment?.startupName?.charAt(0) || meetup.govDepartment?.name?.charAt(0) || "SH"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A1A2E] whitespace-normal break-words group-hover:underline underline-offset-4">
                      {meetup.govDepartment?.startupName || meetup.govDepartment?.name}
                    </p>
                  </div>
                </Link>
             </div>
          </div>

          {/* Going / Attendees Count */}
          <div className="space-y-3 pt-2">
             <h4 className="text-base sm:text-lg font-medium text-[#1A1A2E]">
               <span>{meetup._count?.registrations || 0} Registered</span>
             </h4>
             <Separator className="bg-black/10" />
          </div>

          <div className="p-6 rounded-xl border border-dashed border-[#1A1A2E]/10 flex flex-col items-center text-center space-y-3 mt-4">
            <div className="h-10 w-10 rounded-full bg-[#F5F5EE] flex items-center justify-center">
              <Info className="w-5 h-5 text-[#1A1A2E]/20" />
            </div>
            <p className="text-[10px] font-black text-[#1A1A2E]/40 uppercase tracking-wider">
              Note for Attendees
            </p>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
              Invitations are subject to host approval based on alignment and
              capacity.
            </p>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="order-1 md:order-2 md:w-7/12 lg:w-8/12 xl:w-9/12 space-y-8 md:pt-2">
          
          {/* Title & Badge */}
          <div className="space-y-4">
            {meetup.tags && meetup.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {meetup.tags.map((tag: string) => (
                  <Badge key={tag} className="bg-[#F26522]/10 text-[#F26522] border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A2E] tracking-tight leading-tight break-words hyphens-auto">
              {meetup.title}
            </h1>
          </div>

          {/* Quick Date/Time Info */}
          <div className="flex flex-col xl:flex-row gap-5 xl:gap-12 text-sm font-medium text-[#1A1A2E]">
             <div className="flex items-start gap-3 min-w-0">
               <Calendar className="w-4 h-4 text-[#1A1A2E] mt-0.5 shrink-0" />
               <div className="flex flex-col min-w-0">
                 <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-0.5">Date</span>
                 <span className="font-bold text-base break-words leading-tight">{formatDate(meetup.date)}</span>
               </div>
             </div>
             <div className="flex items-start gap-3 min-w-0">
               <Clock className="w-4 h-4 text-[#1A1A2E] mt-0.5 shrink-0" />
               <div className="flex flex-col min-w-0">
                 <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-0.5">Time</span>
                 <span className="font-bold text-base break-words leading-tight">{meetup.time}</span>
               </div>
             </div>
             <div className="flex items-start gap-3 min-w-0">
               <MapPin className="w-4 h-4 text-[#1A1A2E] mt-0.5 shrink-0" />
               <div className="flex flex-col min-w-0">
                 <span className="text-muted-foreground text-[10px] uppercase tracking-widest mb-0.5">Location</span>
                 <span className="font-bold text-base break-words leading-tight">{meetup.location}</span>
               </div>
             </div>
          </div>

        {/* Registration Box */}
          <section className="p-6 border border-black/15 rounded-2xl">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#1A1A2E] break-words">
                    {meetup.isApplied ? (meetup.registrationStatus === 'APPROVED' ? 'Registration Confirmed' : meetup.registrationStatus === 'WAITLISTED' ? 'Waitlisted' : 'Registration Pending') : isFull ? 'Session Full' : 'Open for Registration'}
                  </h2>
                </div>
                
                <div className="shrink-0 w-full sm:w-auto">
                  {meetup.isApplied ? (
                    <button
                      disabled
                      className={cn(
                        "w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold uppercase tracking-wide text-[10px] cursor-not-allowed text-center",
                        meetup.registrationStatus === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {meetup.registrationStatus === "APPROVED" ? "Registered" : "Applied"}
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isRegistering || isFull}
                      className={cn(
                        "w-full sm:w-auto px-6 py-2.5 rounded-lg font-black uppercase tracking-widest text-[10px] text-center transition-all",
                        isFull 
                          ? "bg-muted text-muted-foreground cursor-not-allowed" 
                          : "bg-[#F26522] text-white hover:shadow-lg hover:shadow-[#F26522]/20 hover:opacity-90"
                      )}
                    >
                      {isRegistering
                        ? "Processing..."
                        : isFull
                          ? "Full"
                          : "Register Now"}
                    </button>
                  )}
                </div>
             </div>
          </section>

          {/* About Event */}
          <section className="space-y-2 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About the Briefing/Workshop</h3>
            <div className="prose prose-sm sm:prose-base max-w-none text-[#1A1A2E]/80 whitespace-pre-wrap break-words">
              {meetup.description || "No description provided."}
            </div>
          </section>

          {/* Format & Tags */}
          {(meetup.format || (meetup.tags && meetup.tags.length > 0)) && (
            <section className="space-y-2 pt-4 border-t border-muted/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {meetup.format && (
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-[#1A1A2E]/50 uppercase tracking-widest">Format</p>
                    <p className="text-sm font-bold text-[#1A1A2E]">{meetup.format.replace('_', ' ')}</p>
                  </div>
                )}
                {meetup.tags && meetup.tags.length > 0 && (
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-[#1A1A2E]/50 uppercase tracking-widest">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {meetup.tags.map(tag => (
                        <Badge key={tag} className="bg-[#1A1A2E]/5 text-[#1A1A2E] border-none px-3 py-1 shadow-none font-semibold">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Speakers */}
          {meetup.speakers && Array.isArray(meetup.speakers) && meetup.speakers.length > 0 && (
            <section className="space-y-2 pt-4 border-t border-muted/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Speakers</h3>
              <div className="flex flex-col gap-1.5">
                {meetup.speakers.map((speaker: any, i: number) => {
                  const content = (
                    <p className="text-base text-[#1A1A2E] leading-tight transition-colors">
                      <span className="font-bold underline underline-offset-2 decoration-black/20 group-hover:decoration-[#F26522]">{speaker.name}</span>
                      {speaker.role && <span className="font-medium"> - {speaker.role}</span>}
                      {speaker.company && <span className="font-medium"> - {speaker.company}</span>}
                    </p>
                  );
                  return (speaker.socialUrl || speaker.link) ? (
                    <a key={i} href={speaker.socialUrl || speaker.link} target="_blank" rel="noopener noreferrer" className="group hover:text-[#F26522] transition-colors block">
                      {content}
                    </a>
                  ) : (
                    <div key={i} className="group">
                      {content}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Agenda */}
          {meetup.agenda && Array.isArray(meetup.agenda) && meetup.agenda.length > 0 && (
            <section className="space-y-3 pt-4 border-t border-muted/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Agenda</h3>
              <div className="relative">
                <div className="absolute left-[5px] top-2 bottom-4 w-[2px] bg-[#1A1A2E]/10" />
                <div className="space-y-4">
                  {meetup.agenda.map((item: any, i: number) => (
                    <div key={i} className="relative pl-6 z-10">
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#F5F5EE] border-2 border-[#F26522]" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-black text-[#F26522] mb-0.5 tracking-wide break-words">{item.time || 'TBA'}</span>
                        <p className="text-base font-bold text-[#1A1A2E] leading-tight break-words">{item.title}</p>
                        {item.description && <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed break-words">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
