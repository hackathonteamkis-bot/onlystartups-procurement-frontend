"use client";

import { useState } from "react";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { Textarea } from "@onlystartups/ui";
import { toast } from "sonner";
import { createMeetup } from "@/actions/events";

interface CreateEventDialogProps {
  onSuccess?: () => void;
}

export function CreateEventDialog({ onSuccess }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      date: new Date(formData.get("date") as string),
      time: formData.get("time") as string,
      maxAttendees: formData.get("maxAttendees")
        ? parseInt(formData.get("maxAttendees") as string)
        : undefined,
    };

    try {
      const res = await createMeetup(data);
      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1A2E] text-white font-bold hover:bg-[#F26522] transition-all text-sm">
          <Plus className="w-5 h-5 mb-0.5" />
          Host New Event
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="h-12 w-12 rounded-xl bg-[#F5F5EE] flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-[#F26522]" />
          </div>
          <DialogTitle className="text-2xl font-black text-[#1A1A2E]">
            Host an Event
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]/40"
              >
                Event Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Pitch Night: AI & Web3"
                required
                className="h-12 bg-[#F5F5EE]/50 border-none rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]/40"
                >
                  Date
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="h-12 bg-[#F5F5EE]/50 border-none rounded-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="time"
                  className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]/40"
                >
                  Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  required
                  className="h-12 bg-[#F5F5EE]/50 border-none rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]/40"
              >
                Location / URL
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A2E]/20" />
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Koramangala Hub or Zoom Link"
                  required
                  className="pl-11 h-12 bg-[#F5F5EE]/50 border-none rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxAttendees"
                className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]/40"
              >
                Max Capacity
              </Label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A2E]/20" />
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  className="pl-11 h-12 bg-[#F5F5EE]/50 border-none rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]/40"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Share what this session is about..."
                required
                className="min-h-[120px] bg-[#F5F5EE]/50 border-none rounded-xl resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#1A1A2E] hover:bg-[#F26522] rounded-full px-8 font-bold"
            >
              {loading ? "Creating..." : "Publish Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
