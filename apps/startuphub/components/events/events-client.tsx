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
import { useRouter } from "next/navigation";

interface EventsClientProps {
  initialMeetups: any[];
  initialHostedMeetups: any[];
  isStartupHub: boolean;
  userRole?: UserRole;
}

export function EventsClient({
  initialMeetups,
  initialHostedMeetups,
  isStartupHub,
}: EventsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      {isStartupHub && (
        <div className="flex justify-end -mt-16 relative z-10">
          <CreateEventDialog onSuccess={onActionSuccess} />
        </div>
      )}

      {isStartupHub ? (
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
        <div className="space-y-12">
          {/* Founder View: Applied Events */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F26522]" /> Your Registered
              Events
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {initialMeetups
                .filter((m) => m.isApplied)
                .map((meetup) => (
                  <Card
                    key={meetup.id}
                    className="border-none shadow-sm bg-white hover:border-[#F26522]/20 transition-all overflow-hidden group"
                  >
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="w-4 bg-[#F26522]" />
                        <div className="p-6 flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="text-lg font-black text-[#1A1A2E] group-hover:text-[#F26522] transition-colors line-clamp-1">
                                {meetup.title}
                              </h3>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#1A1A2E]/30 tracking-widest">
                                <Badge
                                  variant="outline"
                                  className="h-5 px-1.5 border-none bg-[#F5F5EE] text-[#1A1A2E]/40 rounded-sm"
                                >
                                  Hosted by{" "}
                                  {meetup.startupHub.startupName ||
                                    meetup.startupHub.name}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A2E]">
                              <Calendar className="w-3.5 h-3.5 text-[#F26522]" />{" "}
                              {new Date(meetup.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A2E]">
                              <MapPin className="w-3.5 h-3.5 text-[#F26522]" />{" "}
                              {meetup.location}
                            </div>
                          </div>
                          <div className="pt-2">
                            <Badge className="bg-emerald-100 text-emerald-700 font-black text-[9px] uppercase tracking-widest border-none px-3 py-1 rounded-md">
                              Registered / Pipeline
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {initialMeetups.filter((m) => m.isApplied).length === 0 && (
                <div className="md:col-span-2 py-20 flex flex-col items-center justify-center text-center space-y-6 bg-transparent">
                  <div className="h-16 w-16 rounded-xl bg-[#F5F5EE]/50 flex items-center justify-center border-2 border-dashed border-[#F26522]/20">
                    <Calendar className="w-6 h-6 text-[#1A1A2E]/20" />
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
          </section>
        </div>
      )}
    </div>
  );
}
