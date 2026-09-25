"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  Users2,
  MonitorPlay,
} from "lucide-react";
import { UserRole } from "@/schemas";
import { updateMeetupRegistrationStatus } from "@/actions/events";
import { CreateEventDialog } from "@/components/events/create-event-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EventsClientProps {
  initialMeetups: any[];
  initialHostedMeetups: any[];
  isGovDepartment: boolean;
  userRole?: UserRole;
}

const formatTimelineDate = (dateString: string) => {
  const d = new Date(dateString);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  if (year === currentYear) {
      return `${month} ${day}`;
  }
  return `${month} ${day}, ${year}`;
};

const formatDay = (dateString: string) => {
  return new Date(dateString).toLocaleString('default', { weekday: 'long' });
};

const getBadgeProps = (status: string) => {
  switch (status) {
    case "APPROVED":
      return { label: "Going", bg: "bg-[#16A34A]" };
    case "INVITED":
      return { label: "Invited", bg: "bg-[#2563EB]" };
    case "PENDING":
    default:
      return { label: "Pending", bg: "bg-[#F97316]" };
  }
};

const isEventLive = (dateStr: string, timeStr: string) => {
  try {
    const eventDate = new Date(dateStr);
    const now = new Date();
    
    if (eventDate.toDateString() === now.toDateString()) {
      const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3]?.toUpperCase();
        
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        const eventStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        const eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000); // assume 2 hours duration
        
        return now >= eventStart && now <= eventEnd;
      }
      return true; // Fallback to 'true' if it's today but time can't be parsed
    }
    return false;
  } catch {
    return false;
  }
};

export function EventsClient({
  initialMeetups,
  initialHostedMeetups,
  isGovDepartment,
}: EventsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const groupedMeetups = initialMeetups
    .filter((m) => m.isApplied)
    .reduce((acc: Record<string, any[]>, meetup) => {
      const date = new Date(meetup.date);
      const dateKey = date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(meetup);
      return acc;
    }, {});

  const sortedDates = Object.keys(groupedMeetups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const handleStatusUpdate = async (
    regId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      const res = await updateMeetupRegistrationStatus(regId, status);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const onActionSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {isGovDepartment && (
        <div className="flex justify-end -mt-16 relative z-10">
          <CreateEventDialog onSuccess={onActionSuccess} />
        </div>
      )}

      {isGovDepartment ? (
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#F26522]" /> Hosted Event
              Pipeline
            </h2>
            <div className="grid gap-6">
              {initialHostedMeetups.map((meetup) => (
                <Card
                  key={meetup.id}
                  className="border-none shadow-sm bg-white hover:border-[#F26522]/20 transition-all"
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">
                          {meetup.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs font-bold text-[#1A1A2E]/40 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#F26522]" />{" "}
                            {new Date(meetup.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#F26522]" />{" "}
                            {meetup.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-[#F26522]" />{" "}
                            {meetup.registrations.length} Applications
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-[#F5F5EE] border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-wider text-[#1A1A2E]/60 h-8"
                      >
                        {meetup.location}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/30 mb-2">
                        Pending registrations
                      </p>
                      {meetup.registrations.filter(
                        (r: any) => r.status === "PENDING",
                      ).length === 0 ? (
                        <p className="text-xs text-[#1A1A2E]/40 italic py-4 border-2 border-dashed border-[#F5F5EE] rounded-2xl text-center font-bold">
                          No pending requests for this session.
                        </p>
                      ) : (
                        <div className="grid gap-2">
                          {meetup.registrations
                            .filter((r: any) => r.status === "PENDING")
                            .map((reg: any) => (
                              <div
                                key={reg.id}
                                className="p-4 rounded-2xl bg-[#F5F5EE]/30 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4 text-left">
                                  <Avatar className="h-10 w-10 border border-[#F26522]/10">
                                    <AvatarImage src={reg.user.image} />
                                    <AvatarFallback className="bg-[#1A1A2E] text-white text-[10px] font-bold">
                                      {`${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim()?.charAt(0) || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-black text-[#1A1A2E]">
                                      {`${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim()}
                                    </p>
                                    <p className="text-[10px] font-bold text-[#F26522] uppercase">
                                      {reg.user.startupName || "Startup"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(reg.id, "REJECTED")
                                    }
                                    className="h-9 w-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(reg.id, "APPROVED")
                                    }
                                    className="h-9 w-9 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {initialHostedMeetups.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-xl border border-[#F5F5EE] shadow-sm">
                  <div className="h-20 w-20 rounded-xl bg-[#F5F5EE]/50 flex items-center justify-center">
                    <MonitorPlay className="w-8 h-8 text-[#1A1A2E]/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-[#1A1A2E]">
                      No Events Launched
                    </h3>
                    <p className="text-sm text-[#1A1A2E]/60 max-w-sm font-medium">
                      Start hosting events, workshops, or strategic sessions
                      for the community.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* Founder View: Applied Events Timeline */}
          <section className="space-y-6">
            <div className="relative">
              {/* Timeline dashed line */}
              <div className="absolute left-[11px] md:left-[88px] top-4 bottom-0 w-px border-l-2 border-dashed border-[#1A1A2E]/20" />
              
              <div className="space-y-8 md:space-y-12">
                {sortedDates.length > 0 ? sortedDates.map((dateKey) => {
                  const dateMeetups = groupedMeetups[dateKey];
                  return (
                    <div key={dateKey} className="flex flex-col md:flex-row gap-4 md:gap-10 group relative">
                      <div className="md:w-[72px] shrink-0 md:text-right relative pt-2 pl-8 md:pl-0">
                         {/* The dot */}
                         <div className="absolute left-[6px] md:left-auto md:-right-[23px] top-3 w-3 h-3 rounded-full bg-[#1A1A2E]/20 border-4 border-[#F5F5EE] group-hover:bg-[#F26522] transition-colors z-10" />
                         <div className="flex md:block items-baseline gap-2">
                           <div className="text-sm font-black text-[#1A1A2E]">{formatTimelineDate(dateKey)}</div>
                           <div className="text-xs text-[#1A1A2E]/50 md:mt-1 uppercase tracking-widest font-bold">{formatDay(dateKey)}</div>
                         </div>
                      </div>
                      
                      <div className="flex-1 space-y-6 pl-8 md:pl-0">
                        {dateMeetups.map((meetup) => {
                          const badge = getBadgeProps(meetup.registrationStatus || "PENDING");
                          const totalRegs = meetup._count?.registrations || 0;
                          return (
                          <div key={meetup.id} className="bg-transparent backdrop-blur-xl border border-[#1A1A2E]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#F26522]/30 group/card cursor-pointer"
                               onClick={() => {
                                 router.push(`/explore/events/${meetup.id}`);
                               }}>
                             <div className="flex-1 min-w-0 space-y-4 sm:space-y-3">
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                   {isEventLive(meetup.date, meetup.time) && (
                                     <div className="flex items-center gap-1.5 text-[#F26522]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F26522] animate-pulse" />
                                        LIVE
                                     </div>
                                   )}
                                   <span className="text-[#1A1A2E]/50 font-bold">{meetup.time}</span>
                                </div>
                                
                                <h3 className="text-xl font-black text-[#1A1A2E] leading-tight group-hover/card:text-[#F26522] transition-colors">
                                  {meetup.title}
                                </h3>
                                
                                <div className="flex flex-col gap-2 text-sm text-[#1A1A2E]/70 font-medium pb-1">
                                  <div className="flex items-start gap-2">
                                    <Avatar className="w-5 h-5 border border-[#1A1A2E]/10 shrink-0 mt-0.5">
                                      <AvatarImage src={meetup.govDepartment?.image} />
                                      <AvatarFallback className="text-[8px] bg-[#F5F5EE] text-[#1A1A2E] font-bold">{meetup.govDepartment?.name?.charAt(0) || "?"}</AvatarFallback>
                                    </Avatar>
                                    <span className="leading-snug">By {meetup.govDepartment?.govDepartmentName || meetup.govDepartment?.name}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-[#1A1A2E]/40 shrink-0 mt-0.5" />
                                    <span className="leading-snug">{meetup.location || "Virtual"}</span>
                                  </div>
                                </div>
                                
                                {/* Mobile-only Image positioned below location */}
                                <div className="sm:hidden w-full aspect-video rounded-xl bg-gray-100/50 overflow-hidden border border-muted/20">
                                  {meetup.image ? (
                                    <Image src={meetup.image} alt={meetup.title} fill unoptimized className="w-full h-full object-cover transition-transform group-hover/card:scale-105 duration-500" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-gray-100/50">
                                      <Calendar className="w-10 h-10 text-[#1A1A2E]/20" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap pt-1">
                                  <Badge className={`${badge.bg} hover:${badge.bg} text-white border-none rounded-md px-3 py-1 font-black text-[10px] uppercase tracking-widest`}>
                                    {badge.label}
                                  </Badge>
                                  {/* Real Avatars */}
                                  <div className="flex -space-x-2">
                                     {meetup.registrations?.slice(0, 3).map((reg: any, i: number) => {
                                       const gradients = [
                                         "from-blue-100 to-purple-200",
                                         "from-green-100 to-emerald-200",
                                         "from-orange-100 to-red-200"
                                       ];
                                       const getInitials = (name?: string) => {
                                         if (!name) return "?";
                                         return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                       };
                                       return (
                                         <Avatar key={reg.id || i} className="w-7 h-7 border-2 border-white/80 shrink-0">
                                           <AvatarImage src={reg.user?.image || ""} className="object-cover" />
                                           <AvatarFallback className={`bg-gradient-to-tr ${gradients[i % 3]} text-[9px] font-black text-[#1A1A2E]`}>
                                             {getInitials(reg.user?.name)}
                                           </AvatarFallback>
                                         </Avatar>
                                       );
                                     })}
                                     {totalRegs > 3 && (
                                       <div className="w-7 h-7 rounded-full bg-[#F5F5EE]/50 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-[9px] font-black text-[#1A1A2E] z-10 relative shrink-0">
                                         +{totalRegs - 3}
                                       </div>
                                     )}
                                  </div>
                                </div>
                             </div>
                             
                             {/* Desktop-only Right Image */}
                             <div className="hidden sm:block w-[240px] aspect-video rounded-2xl bg-gray-100/50 overflow-hidden shrink-0 border border-muted/20">
                               {meetup.image ? (
                                 <Image src={meetup.image} alt={meetup.title} fill unoptimized className="w-full h-full object-cover transition-transform group-hover/card:scale-105 duration-500" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-gray-100/50">
                                   <Calendar className="w-10 h-10 text-[#1A1A2E]/20" />
                                 </div>
                               )}
                             </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  )
                }) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="h-16 w-16 rounded-xl bg-white border border-muted/60 flex items-center justify-center shadow-sm">
                      <Calendar className="w-6 h-6 text-[#1A1A2E]/40" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-[#1A1A2E]">
                        No Active Registrations
                      </h3>
                      <Link href="/explore">
                        <button className="mt-4 px-6 py-2.5 rounded-full bg-[#1A1A2E] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#F26522] transition-all">
                          Explore Events
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
