"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Label
} from "@onlystartups/ui";
import { Calendar, Video, ArrowRight, Loader2, MessageSquare, ExternalLink } from "lucide-react";
import { format, isAfter, isBefore, addHours } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MentorDashboardClient({ profile }: { profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const router = useRouter();

  if (!profile) return null;

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSession) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const feedback = formData.get("feedback") as string;

    try {
      const response = await fetch(`/api/mentor-sessions/${selectedSession.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', feedback: { mentorNotes: feedback } })
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      
      toast.success("Feedback submitted successfully");
      setSelectedSession(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();
  
  // Sort sessions: upcoming first, then past
  const upcomingSessions = profile.sessions?.filter((s: any) => isAfter(new Date(s.date), now) && s.status !== 'COMPLETED').sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  const pastSessions = profile.sessions?.filter((s: any) => isBefore(new Date(s.date), now) || s.status === 'COMPLETED').sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Mentor Dashboard"
        description="View your upcoming sessions and log feedback."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F26522]" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>No upcoming sessions scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session: any) => (
                    <div key={session.id} className="p-4 bg-white rounded-xl border border-muted/50 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-shadow hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={session.startup?.image} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {session.startup?.startupName?.charAt(0) || session.startup?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-[#1A1A2E] text-lg leading-tight">
                            {session.startup?.startupName || session.startup?.name}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                            <span className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(session.date), 'MMM d, yyyy')} {session.time && `at ${session.time}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        {session.meetLink && (
                          <Button variant="outline" size="sm" asChild className="rounded-full border-[#F26522]/20 text-[#F26522] hover:bg-[#F26522]/10">
                            <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
                              <Video className="w-4 h-4 mr-2" />
                              Join Call
                            </a>
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedSession(session)}
                          className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-xl"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Log Feedback
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Past Sessions & Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {pastSessions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No past sessions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastSessions.map((session: any) => (
                    <div key={session.id} className="p-4 bg-muted/30 rounded-xl border border-muted/50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">{session.startup?.startupName?.charAt(0) || "S"}</AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-sm text-[#1A1A2E]">
                            {session.startup?.startupName || session.startup?.name}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            {format(new Date(session.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-xs">
                          Completed
                        </Badge>
                      </div>
                      
                      {session.mentorNotes ? (
                        <div className="text-sm text-[#1A1A2E]/80 pl-8 border-l-2 border-emerald-200 py-1">
                          {session.mentorNotes}
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedSession(session)}
                          className="text-[#F26522] h-auto p-0 hover:bg-transparent hover:underline text-xs pl-8"
                        >
                          Missing feedback. Click to log now.
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-[#1A1A2E] text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Mentor Guide</h3>
              <p className="text-white/70 text-sm mb-4">
                Thank you for contributing to the startup ecosystem! Here are some quick tips for your sessions:
              </p>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-[#F26522] shrink-0" /> Review the startup&apos;s profile before the call.</li>
                <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-[#F26522] shrink-0" /> Focus on actionable advice rather than general theory.</li>
                <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-[#F26522] shrink-0" /> Log feedback immediately after the call while it&apos;s fresh.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Post-Session Feedback</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Log your key advice for <strong className="text-[#1A1A2E]">{selectedSession?.startup?.startupName || selectedSession?.startup?.name}</strong>. 
              This will be shared with the incubator admin.
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Session Notes & Advice</Label>
                <Textarea 
                  id="feedback" 
                  name="feedback" 
                  required 
                  placeholder="What was discussed? Any urgent problems flagged? What are their next steps?"
                  className="min-h-[150px] resize-none"
                  defaultValue={selectedSession?.mentorNotes || ""}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="bg-[#F26522] hover:bg-[#F26522]/90 text-white" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
