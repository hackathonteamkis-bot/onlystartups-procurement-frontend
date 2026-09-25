"use client";
import * as z from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import React, { useState, useTransition } from "react";
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
import { Input } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { setupPassword } from "@/actions/auth/setup-password";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const SetupPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Requires 8+ chars: a-z, A-Z, 0-9, #$%" })
      .regex(/[A-Z]/, { message: "Requires 8+ chars: a-z, A-Z, 0-9, #$%" })
      .regex(/[a-z]/, { message: "Requires 8+ chars: a-z, A-Z, 0-9, #$%" })
      .regex(/[0-9]/, { message: "Requires 8+ chars: a-z, A-Z, 0-9, #$%" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Requires 8+ chars: a-z, A-Z, 0-9, #$%",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SetupPasswordForm = () => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SetupPasswordSchema>>({
    resolver: zodResolver(SetupPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SetupPasswordSchema>) => {
    startTransition(async () => {
      const result = await setupPassword(values);
      if (result?.error) {
        toast.error(result.error);
      }
      if (result?.success) {
        toast.success("Password set successfully! Redirecting to onboarding...");
        // Update the session so needsPasswordChange becomes false
        await update({ user: { needsPasswordChange: false } });
        // Hard redirect to onboarding
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 1000);
      }
    });
  };

  return (
    <CardWrapper headerLabel="Set Your Password">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#F26522]" />
          <p className="text-xs font-medium text-[#1A1A2E]/60">
            Secure your account
          </p>
        </div>
        <p className="text-xs text-[#1A1A2E]/50 leading-relaxed">
          You&apos;re currently using a temporary password. Please set a new
          permanent password to secure your account.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your new password"
                      type="password"
                      className="h-10 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500/80 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Re-enter your new password"
                      type="password"
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
            className="w-full h-11 bg-[#F26522] hover:bg-[#F26522]/95 text-white font-bold rounded-full sm:rounded-full transition-all duration-300 text-sm active:scale-[0.98]"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Set Password & Continue"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
