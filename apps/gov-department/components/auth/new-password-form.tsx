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
import { NewPasswordSchema } from "@/schemas";
import { Input } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { newPassword } from "@/actions/auth/new-password";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export const NewPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a New Password"
      backButtonHref="/"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[#1A1A2E]/80 font-medium text-xs">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
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
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Reset Password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
