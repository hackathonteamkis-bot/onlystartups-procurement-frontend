"use client";

import { useState } from "react";
import { Plus, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@onlystartups/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { scheduleMentorSession } from "@/actions/startup-hub";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@onlystartups/ui";

const formSchema = z.object({
  userId: z.string().min(1, "Founder is required"),
  mentorName: z.string().min(2, "Mentor name is too short"),
  expertise: z.string().min(2, "Expertise is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export function ScheduleSessionDialog({ 
  onSuccess,
  startups 
}: { 
  onSuccess: () => void;
  startups: any[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      mentorName: "",
      expertise: "",
      date: "",
      time: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await scheduleMentorSession({
        ...values,
        date: new Date(values.date),
      });

      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        form.reset();
        onSuccess();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1A2E] text-white font-bold hover:bg-[#F26522] transition-all text-sm">
          <Plus className="w-5 h-5 mb-0.5" />
          Schedule Session
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bridge Mentorship Session</DialogTitle>
          <DialogDescription>
            Connect a startup in your portfolio with a mentor for a 1-on-1 session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup / Founder</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select startup" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startups?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.startupName || s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mentorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sarah Jennings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise (Focus area)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. GTM Strategy, Fundraising" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-[#1A1A2E] hover:bg-emerald-600 font-bold" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
