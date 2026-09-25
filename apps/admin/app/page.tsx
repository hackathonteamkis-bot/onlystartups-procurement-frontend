"use client";

import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function AdminLanding() {
  return (
    <div className="min-h-screen bg-[#F5F5EE] flex flex-col items-center justify-center p-4 selection:bg-[#F26522] selection:text-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4">
            <Image src="/logo/os-logo-blue.svg" alt="OnlyStartups Logo" width={64} height={64} className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] font-serif italic">Admin Portal</h1>
        </div>

        <div className="w-full flex justify-center">
          <Suspense fallback={<div className="h-[200px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin"></div></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
