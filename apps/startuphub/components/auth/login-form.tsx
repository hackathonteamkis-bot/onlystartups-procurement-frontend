"use client";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import React, { useState, useTransition, useEffect } from "react";
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
import { LoginSchema } from "@/schemas";
import { useSearchParams } from "next/navigation";
import { Input } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import Link from "next/link";
import { login } from "@/actions/auth/login";
import { toast } from "sonner";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Show toast notification for OAuth errors
  useEffect(() => {
    if (searchParams.get("error") === "OAuthAccountNotLinked") {
      toast.error("Account Already Exists", {
        description:
          "This email is already registered with a different sign-in method. Please use your original sign-in method (email/password or different OAuth provider).",
        duration: 8000,
      });
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast.error(data.error);
          }
          if (data?.success === "LOGIN_SUCCESS") {
            window.location.href = DEFAULT_LOGIN_REDIRECT;
            return;
          }

          if (data?.success === "NEEDS_PASSWORD_CHANGE") {
            window.location.href = "/auth/setup-password";
            return;
          }

          if (data?.success) {
            form.reset();
            toast.success(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }

          // Fallback if no specific success/error/twoFactor
          if (!data?.error && !data?.twoFactor && !data?.success) {
            window.location.href = DEFAULT_LOGIN_REDIRECT;
          }
        })
        .catch(() => {
          toast.error("Unable to sign in. Please try again later.");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back!"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 sm:space-y-3"
        >
          <div className="space-y-2">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      Two Factor Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                        className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500/80 text-xs" />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="you@example.com"
                          type="email"
                          className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500/80 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="********"
                        type="password"
                        className="h-9 bg-white border-[#1A1A2E]/10 focus:border-[#F26522] focus:ring-[#F26522]/20 rounded-full sm:rounded-full text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 transition-all duration-200 text-sm"
                      />
                    </FormControl>

                    <div className="flex justify-end -mt-1">
                      <Button
                        size={"sm"}
                        variant={"link"}
                        asChild
                        className="h-auto p-0 font-medium text-[#1A1A2E]/40 hover:text-[#F26522] transition-colors duration-200 text-[11px]"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                    </div>
                    <FormMessage className="text-red-500/80 text-xs" />
                  </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-10 bg-[#F26522] hover:bg-[#F26522]/95 text-white font-bold rounded-full sm:rounded-full transition-all duration-300 text-sm active:scale-[0.98]"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : showTwoFactor ? (
              "Confirm"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
