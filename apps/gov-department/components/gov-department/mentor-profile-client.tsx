"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ScheduleSessionModal } from "./schedule-session-modal";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@onlystartups/ui";
import { Mail, Calendar, Video, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export function MentorProfileClient({ profile, startups = [] }: { profile: any; startups?: any[] }) {
  if (!profile) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Mentor Profile"
        description="View mentor details and past sessions."
      >
        <ScheduleSessionModal mentorId={profile.id} startups={startups} />
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-white shadow-sm">
              <AvatarImage src={profile.user.image} />
              <AvatarFallback className="bg-[#1A1A2E] text-white text-2xl font-bold">
                {`${(profile.user as any).firstName || ''} ${(profile.user as any).lastName || ''}`.trim()?.charAt(0) || "M"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-[#1A1A2E]">{`${(profile.user as any).firstName || ''} ${(profile.user as any).lastName || ''}`.trim()}</h2>
            <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1 mb-4">
              <Mail className="w-4 h-4" />
              {profile.user.email}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {profile.expertise?.map((exp: string, i: number) => (
                <Badge key={i} variant="secondary" className="bg-[#F26522]/10 text-[#F26522] border-none">
                  {exp}
                </Badge>
              ))}
            </div>

            <div className="w-full pt-6 border-t border-muted">
              <h3 className="font-semibold text-sm text-left mb-3">Availability</h3>
              <div className="space-y-2 text-sm text-left text-muted-foreground">
                {Object.entries(profile.availability || {}).map(([day, slots]: [string, any]) => (
                  slots.length > 0 && (
                    <div key={day} className="flex justify-between items-center">
                      <span className="capitalize">{day}</span>
                      <span className="font-medium text-[#1A1A2E]">{slots.join(', ')}</span>
                    </div>
                  )
                ))}
                {Object.values(profile.availability || {}).every((s: any) => s.length === 0) && (
                  <p className="text-center text-xs italic">No weekly hours set yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.sessions?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No sessions logged yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.sessions?.map((session: any) => (
                  <div key={session.id} className="p-4 bg-white rounded-xl border border-muted/50 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback>{session.startup?.name?.charAt(0) || "S"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-[#1A1A2E]">{session.startup?.startupName || session.startup?.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(session.date), 'MMM d, yyyy')} {session.time && `at ${session.time}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        session.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        session.status === 'CONFIRMED' ? "bg-blue-50 text-blue-600 border-blue-200" :
                        "bg-yellow-50 text-yellow-600 border-yellow-200"
                      }>
                        {session.status}
                      </Badge>
                    </div>

                    {session.mentorNotes && (
                      <div className="bg-muted/30 p-3 rounded-lg flex gap-3 items-start">
                        <MessageSquare className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                        <div className="text-sm text-[#1A1A2E]/80">
                          <span className="font-semibold block mb-1">Mentor&apos;s Feedback:</span>
                          {session.mentorNotes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
