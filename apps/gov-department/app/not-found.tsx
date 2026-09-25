import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen relative bg-[#F5F5EE] flex flex-col overflow-hidden font-sans text-[#1A1A2E] selection:bg-[#F26522] selection:text-white">
      {/* Subtle Ambient Glows */}
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#F26522]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-5xl w-full px-6 mx-auto animate-fade-in">
        <div className="flex flex-col items-center text-center w-full">
          {/* 404 Number */}
          <h1 className="font-(family-name:--font-instrument-serif) text-[10rem] sm:text-[14rem] md:text-[18rem] font-bold tracking-tight leading-none text-[#1A1A2E]/10 select-none mb-[-4rem] sm:mb-[-6rem] md:mb-[-8rem]">
            404
          </h1>

          {/* Heading */}
          <h2 className="font-(family-name:--font-instrument-serif) text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-[#1A1A2E] mb-6 sm:mb-8 text-balance">
            <span className="block">Oops! You&apos;ve</span>
            <span className="block italic">wandered off course.</span>
          </h2>

          {/* Subtitle */}
          <p className="max-w-xs sm:max-w-xl md:max-w-2xl text-base sm:text-lg md:text-xl text-[#1A1A2E]/70 font-medium leading-relaxed mb-10 sm:mb-12 text-balance mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 bg-[#1A1A2E] text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-[#2A2A3E] hover:shadow-xl hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Go Back Home
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm border border-[#1A1A2E]/10 text-[#1A1A2E] px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105"
            >
              Explore Startup Hubs
            </Link>
          </div>

          {/* Info Text */}
          <div className="mt-16 flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-[#1A1A2E]/60 font-medium px-4">
            <span className="whitespace-nowrap">Error 404</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-30" />
            <span className="whitespace-nowrap">Page Not Found</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-30" />
            <span className="whitespace-nowrap">OnlyStartups</span>
          </div>
        </div>
      </div>
    </div>
  );
}
