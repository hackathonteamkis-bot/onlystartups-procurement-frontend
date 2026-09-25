"use client";

import { signIn } from "next-auth/react";
import { Button } from "@onlystartups/ui";
import { BsGoogle } from "react-icons/bs";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {
  const onClick = async (provider: "google") => {
    // Sign in with OAuth - use redirect: false to handle the redirect ourselves
    const result = await signIn(provider, {
      redirect: false,
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });

    // If successful, do a hard redirect to force session refresh
    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Divider with text */}
      <div className="flex items-center justify-center gap-3">
        <span className="flex-1 h-px bg-[#1A1A2E]/10" />
        <span className="text-[10px] sm:text-xs text-[#1A1A2E]/40 font-bold uppercase tracking-widest">
          or
        </span>
        <span className="flex-1 h-px bg-[#1A1A2E]/10" />
      </div>

      {/* Google Button */}
      <Button
        className="w-full bg-white hover:bg-[#F5F5EE] border border-[#1A1A2E]/10 hover:border-[#1A1A2E]/20 text-[#1A1A2E] font-semibold rounded-full sm:rounded-full h-10 transition-all duration-300 shadow-sm hover:shadow-md"
        size="lg"
        onClick={() => onClick("google")}
        variant="outline"
      >
        <BsGoogle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-[#1A1A2E]" />
        <span className="text-xs sm:text-sm">Continue with Google</span>
      </Button>
    </div>
  );
};

export default Social;
