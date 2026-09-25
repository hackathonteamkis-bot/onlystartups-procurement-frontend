import Image from "next/image";
import { WebGLFluidGradient } from "@/components/landing-page/webgl-fluid-gradient";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-svh relative bg-[#F5F5EE] flex overflow-hidden font-sans text-[#1A1A2E] selection:bg-[#F26522] selection:text-white">
      {/* Global Subtle Ambient Glows */}
      <div className="absolute top-[-20%] left-[60%] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bg-[#F26522]/10 rounded-full blur-[80px] lg:blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] bg-[#1A1A2E]/5 rounded-full blur-[100px] lg:blur-[120px] pointer-events-none"></div>

      {/* Left Side - Branding Panel (Hidden on mobile, visible on md+) */}
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
          {/* Logo with Glow */}
          <div className="relative mb-8 lg:mb-10">
            <div className="absolute inset-0 w-32 h-32 lg:w-36 lg:h-36 xl:w-44 xl:h-44 bg-[#F26522]/20 rounded-full blur-3xl -m-4"></div>
            <div className="w-24 h-24 lg:w-28 lg:h-28 xl:w-36 xl:h-36 relative">
              <Image
                src="/logo/os-logo-blue.svg"
                alt="OnlyStartups"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="font-sans text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold tracking-tight text-[#1A1A2E] mb-6">
            <span className="block">Welcome to</span>
            <span className="block font-serif font-normal italic">OnlyStartups.</span>
          </h1>

          {/* Tagline */}
          <p className="text-[#1A1A2E]/70 text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed max-w-md mx-auto text-center">
            Shared Workspace for{" "}
            <span className="font-bold text-[#1A1A2E]">Startup Hubs & Founders.</span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mt-8 lg:mt-10">
            <span className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 text-[#1A1A2E]/70 text-xs lg:text-sm font-medium">
              Unified Infrastructure
            </span>
            <span className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 text-[#1A1A2E]/70 text-xs lg:text-sm font-medium">
              Startup Hubs
            </span>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Fluid Background */}
      <div className="absolute inset-0 md:hidden z-0 overflow-hidden">
        <WebGLFluidGradient theme="orange" />
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full md:w-7/12 lg:w-1/2 xl:w-[45%] h-full flex flex-col relative px-4 sm:px-8 overflow-y-auto z-10">

        <div className="flex flex-col items-center justify-center m-auto min-h-min py-8 sm:py-12 w-full">
          {/* Logo for mobile only */}
          <div className="md:hidden relative mb-6 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 w-20 h-20 bg-[#F26522]/10 rounded-full blur-2xl -m-2"></div>
              <div className="w-14 h-14 relative">
                <Image
                  src="/logo/os-logo-blue.svg"
                  alt="OnlyStartups"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
