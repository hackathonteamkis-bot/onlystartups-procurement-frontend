"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { updateAvailability } from "@/actions/mentors";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from "@onlystartups/ui";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export function MentorAvailabilityClient({ profile }: { profile: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const meetLink = formData.get("meetLink") as string;
    
    // Quick parsing of availability inputs
    const availability = {
      monday: (formData.get("monday") as string).split(',').map(s => s.trim()).filter(Boolean),
      tuesday: (formData.get("tuesday") as string).split(',').map(s => s.trim()).filter(Boolean),
      wednesday: (formData.get("wednesday") as string).split(',').map(s => s.trim()).filter(Boolean),
      thursday: (formData.get("thursday") as string).split(',').map(s => s.trim()).filter(Boolean),
      friday: (formData.get("friday") as string).split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const result = await updateAvailability({ availability, meetLink });
      if (result.error) throw new Error(result.error);
      toast.success("Availability updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update availability");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Availability & Scheduling"
        description="Set your weekly available hours and meeting link."
      />

      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-lg text-[#1A1A2E]">
                <Video className="w-5 h-5 text-[#F26522]" />
                Default Meeting Link
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetLink">Google Meet / Zoom URL</Label>
                <Input 
                  id="meetLink" 
                  name="meetLink" 
                  placeholder="https://meet.google.com/abc-defg-hij" 
                  defaultValue={profile?.meetLink || ""}
                />
                <p className="text-xs text-muted-foreground">This link will be sent to founders when they book a session with you.</p>
              </div>
            </div>

            <div className="border-t border-muted pt-6 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-lg text-[#1A1A2E]">
                <CalendarIcon className="w-5 h-5 text-[#F26522]" />
                Weekly Available Hours
              </div>
              <p className="text-sm text-muted-foreground">Enter your available time slots separated by commas (e.g. &quot;10:00 AM, 2:00 PM, 4:30 PM&quot;).</p>

              <div className="space-y-4 mt-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                  <div key={day} className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor={day} className="capitalize text-right">{day}</Label>
                    <Input 
                      id={day} 
                      name={day} 
                      className="col-span-2" 
                      placeholder="10:00 AM, 11:00 AM" 
                      defaultValue={(profile?.availability?.[day] || []).join(', ')}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-muted pt-6 flex justify-end">
              <Button type="submit" className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
