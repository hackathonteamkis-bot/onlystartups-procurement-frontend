"use client";

import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { RequestAccessForm } from "@/components/auth/request-access-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@onlystartups/ui";
import { Building2, ArrowRight } from "lucide-react";
import { WebGLFluidGradient } from "@/components/webgl-fluid-gradient";

export default function GovDepartmentLanding() {
  return (
    <div className="h-svh relative bg-[#F5F5EE] flex overflow-hidden font-sans text-[#1A1A2E] selection:bg-[#F26522] selection:text-white">
      {/* Global Subtle Ambient Glows */}
      <div className="absolute top-[-20%] left-[60%] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bg-[#F26522]/10 rounded-full blur-[80px] lg:blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] bg-[#1A1A2E]/5 rounded-full blur-[100px] lg:blur-[120px] pointer-events-none"></div>

      {/* Left Side - Branding Panel (Matches AuthLayout) */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 xl:w-[55%] h-full p-4 lg:p-6">
        <div className="w-full h-full relative flex-col items-center justify-center p-8 lg:p-12 overflow-hidden rounded-2xl flex">
        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(245,245,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,238,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* WebGL Background */}
        <WebGLFluidGradient theme="orange" />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-4 lg:px-8">
          {/* Custom Logo/Icon for Startup Hub */}
          <div className="relative mb-8 lg:mb-10">
            <div className="w-24 h-24 lg:w-28 lg:h-28 xl:w-36 xl:h-36 relative flex items-center justify-center">
              <Image src="/logo/os-logo-blue.svg" alt="OnlyStartups Logo" width={80} height={80} className="w-16 h-16 lg:w-20 lg:h-20" />
            </div>
          </div>

          <h1 className="font-sans text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold tracking-tight text-[#1A1A2E] mb-6">
            <span className="block">The Portal for</span>
            <span className="block font-serif font-normal italic">Startup Hubs.</span>
          </h1>

          <p className="text-[#1A1A2E]/70 text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed max-w-md mx-auto text-center mb-10">
            Built for{" "}
            <span className="text-[#1A1A2E] italic font-serif font-semibold">
              incubators, accelerators, and innovation hubs.
            </span>
            {" "}Manage programs, track startup progress, review applications, and host events all in one seamless workspace.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
            <span className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 text-[#1A1A2E]/70 text-xs lg:text-sm font-medium">
              Venture Intake
            </span>
            <span className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 text-[#1A1A2E]/70 text-xs lg:text-sm font-medium">
              Analytics
            </span>
            <span className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 text-[#1A1A2E]/70 text-xs lg:text-sm font-medium">
              Funding Opportunities
            </span>
          </div>
        </div>
      </div>
      </div>

      {/* Right Side - Form Panel (Matches AuthLayout) */}
      <div className="w-full md:w-7/12 lg:w-1/2 xl:w-[45%] h-full flex flex-col relative px-4 sm:px-8">

        <div className="flex-1 flex flex-col items-center justify-center py-2 sm:py-4">
          {/* Logo for mobile only */}
          <div className="md:hidden relative mb-6 flex flex-col items-center">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <Image src="/logo/os-logo-blue.svg" alt="OnlyStartups Logo" width={32} height={32} className="w-8 h-8" />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white rounded-2xl shadow-sm border border-black/5 p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-xl font-semibold data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white transition-all text-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="request"
                  className="rounded-xl font-semibold data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white transition-all text-sm"
                >
                  Request Access
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-0 outline-none">
                <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin"></div></div>}>
                  <LoginForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="request" className="mt-0 outline-none">
                <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin"></div></div>}>
                  <RequestAccessForm />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
