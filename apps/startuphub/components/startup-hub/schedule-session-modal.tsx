"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Input, Label, Textarea } from "@onlystartups/ui";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@onlystartups/ui";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Loader2, Video, AlertCircle } from "lucide-react";
import { scheduleMentorSession } from "@/actions/startup-hub";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ScheduleSessionModal({ 
  mentorId, 
  startups 
}: { 
  mentorId: string;
  startups: { id: string; name: string }[];
}) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionType, setSessionType] = useState<string>("ONLINE");
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [startupId, setStartupId] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [prepNotes, setPrepNotes] = useState("");

  useEffect(() => {
    if (open) {
      update();
    }
  }, [open, update]);

  const hasGoogleCalendarConnected = (session?.user as any)?.hasGoogleCalendarConnected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        mentorProfileId: mentorId,
        sessionType,
        date,
        time,
        ...(sessionType !== "OFFLINE_BROADCAST" && { startupId }),
        ...(sessionType !== "ONLINE" && { location }),
        ...(sessionType === "OFFLINE_BROADCAST" && { capacity: parseInt(capacity, 10), prepNotes }),
      };

      const result = await scheduleMentorSession(data);
      if (result?.error) throw new Error(result.error);
      
      toast.success("Session scheduled successfully!");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F26522] hover:bg-[#F26522]/90 text-white shadow-sm font-semibold">
          Schedule Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Schedule Mentor Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label>Session Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSessionType("ONLINE")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  sessionType === "ONLINE" 
                    ? "border-[#F26522] bg-[#F26522]/10 text-[#F26522]" 
                    : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                <Video className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Online (Virtual)</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType("OFFLINE_1ON1")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  sessionType === "OFFLINE_1ON1" 
                    ? "border-[#F26522] bg-[#F26522]/10 text-[#F26522]" 
                    : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                <Users className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Offline: 1-on-1</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType("OFFLINE_BROADCAST")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  sessionType === "OFFLINE_BROADCAST" 
                    ? "border-[#F26522] bg-[#F26522]/10 text-[#F26522]" 
                    : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                <Users className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Offline: Broadcast</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-9" value={time} onChange={e => setTime(e.target.value)} required />
              </div>
            </div>
          </div>

          {sessionType !== "OFFLINE_BROADCAST" && (
            <div className="space-y-2">
              <Label>Select Startup</Label>
              <Select value={startupId} onValueChange={setStartupId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a startup" />
                </SelectTrigger>
                <SelectContent>
                  {startups.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name || "Unnamed Startup"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {sessionType === "ONLINE" && !hasGoogleCalendarConnected && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200 flex flex-col gap-3">
              <span>You must connect your Google Calendar in Profile settings to schedule online sessions (required for auto-generating Google Meet links).</span>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                className="w-full bg-white text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800 font-bold"
                onClick={() => {
                  import("next-auth/react").then(({ signIn }) => signIn('google', { prompt: 'consent' }));
                }}
              >
                Connect Google Calendar
              </Button>
            </div>
          )}

          {sessionType !== "ONLINE" && (
            <div className="space-y-2">
              <Label>Location (Room / Area)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="e.g. Conference Room B" className="pl-9" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>
            </div>
          )}

          {sessionType === "OFFLINE_BROADCAST" && (
            <>
              <div className="space-y-2">
                <Label>Capacity (Max Seats)</Label>
                <Input type="number" min="1" placeholder="e.g. 50" value={capacity} onChange={e => setCapacity(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Preparation Notes (Optional)</Label>
                <Textarea placeholder="e.g. Bring laptops..." value={prepNotes} onChange={e => setPrepNotes(e.target.value)} />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90" 
            disabled={loading || (sessionType === 'ONLINE' && !hasGoogleCalendarConnected)}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Confirm Schedule"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
