"use client";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import React, { useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormMessage,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@onlystartups/ui";
import { StartupHubAccessRequestSchema } from "@/schemas";
import { Input } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { toast } from "sonner";
import { requestAccess } from "@/actions/startup-hub/request-access";

export const RequestAccessForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof StartupHubAccessRequestSchema>>({
    resolver: zodResolver(StartupHubAccessRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      startupHubName: "",
      details: "",
    },
  });

  const onSubmit = (values: z.infer<typeof StartupHubAccessRequestSchema>) => {
    startTransition(() => {
      requestAccess(values)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            form.reset();
            toast.success(data.success, {
              duration: 8000,
            });
          }
        })
        .catch(() => {
          toast.error("Unable to submit request. Please try again later.");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Request Access"
      showSocial={false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Ansh"
                        className="h-10 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500/80 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Varma"
                        className="h-10 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500/80 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="you@yourstartuphub.com"
                      type="email"
                      className="h-10 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500/80 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="+91 00000 00000"
                      className="h-10 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500/80 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startupHubName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                    Startup Hub
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Startup Hub Mumbai"
                      className="h-10 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500/80 text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 bg-[#F26522] hover:bg-[#F26522]/95 text-white font-bold rounded-full sm:rounded-full transition-all duration-300 text-sm active:scale-[0.98] mt-2"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
