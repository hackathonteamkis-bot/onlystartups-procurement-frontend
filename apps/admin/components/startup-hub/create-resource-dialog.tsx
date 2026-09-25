"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@onlystartups/ui";
import { createResource } from "@/actions/startup-hub";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  type: z.string(),
  url: z.string().url("Invalid URL"),
  category: z.string(),
  tags: z.string(),
});

export function CreateResourceDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "PDF",
      url: "",
      category: "LMS",
      tags: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await createResource({
        ...values,
        tags: values.tags.split(",").map((t) => t.trim()),
      });

      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        form.reset();
        onSuccess();
      } else {
        toast.error(res.error);
      }
    } catch (err) {
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
          Upload New Resource
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Knowledge Resource</DialogTitle>
          <DialogDescription>
            Add a new video, document, or link for your founder program.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Legal 101 for Startups" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PDF">PDF Document</SelectItem>
                        <SelectItem value="Video">Video Link</SelectItem>
                        <SelectItem value="DOC">Template Doc</SelectItem>
                        <SelectItem value="Link">External Link</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LMS">SMS Content</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Pitching">Pitching</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="legal, template, equity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#F26522] hover:bg-[#F26522]/90 font-bold" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Resource"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
