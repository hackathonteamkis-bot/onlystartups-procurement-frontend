"use client";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import React, { useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormMessage,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@onlystartups/ui";
import { RegisterSchema } from "@/schemas";
import { Input } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { register } from "@/actions/auth/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const password = useWatch({
    control: form.control,
    name: "password",
  }) || "";
  const isLower = /[a-z]/.test(password);
  const isUpper = /[A-Z]/.test(password);
  const isNum = /\d/.test(password);
  const isSpecial = /[!@#$%^&*()]/.test(password);
  const isLength = password.length >= 6;
  const regexFulfilled = isLower && isUpper && isNum && isSpecial && isLength;

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 sm:space-y-3"
        >
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                        First Name
                      </FormLabel>
                      <FormMessage className="text-red-500/80 text-xs" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John"
                        type="text"
                        className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                        Last Name
                      </FormLabel>
                      <FormMessage className="text-red-500/80 text-xs" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Doe"
                        type="text"
                        className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      Email
                    </FormLabel>
                    <FormMessage className="text-red-500/80 text-xs" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="you@example.com"
                      type="email"
                      className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      Password
                    </FormLabel>
                    {(password.length > 0 || (fieldState.error && (fieldState.error.message?.includes("[a-z]") || fieldState.error.message?.includes("6 characters") || fieldState.error.message?.includes("Requires")))) && !regexFulfilled ? (
                      <div className="text-[11px] sm:text-xs flex items-center gap-[2px] flex-wrap justify-end text-red-500/80">
                        <span className={isLength ? "text-emerald-500 transition-colors" : "transition-colors"}>6+ chars</span>
                        <span>,</span>
                        <span className={isLower ? "text-emerald-500 transition-colors" : "transition-colors"}>[a-z]</span>
                        <span>,</span>
                        <span className={isUpper ? "text-emerald-500 transition-colors" : "transition-colors"}>[A-Z]</span>
                        <span>,</span>
                        <span className={isNum ? "text-emerald-500 transition-colors" : "transition-colors"}>[0-9]</span>
                        <span>, and</span>
                        <span className={isSpecial ? "text-emerald-500 transition-colors" : "transition-colors"}>[!@#$.....]</span>
                      </div>
                    ) : (
                      <FormMessage className="text-red-500/80 text-xs" />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                      className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      Confirm Password
                    </FormLabel>
                    <FormMessage className="text-red-500/80 text-xs" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                      className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-10 bg-[#F26522] hover:bg-[#F26522]/95 text-white font-bold rounded-full sm:rounded-full transition-all duration-300 text-sm active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Create Account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
