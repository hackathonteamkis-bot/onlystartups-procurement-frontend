import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";
import { Skeleton } from "@onlystartups/ui";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative">
      <Navbar />

      {/* Subtle background radial ambient lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F26522]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/5 rounded-full blur-[140px]" />
      </div>

      <main className="grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="space-y-6 max-w-2xl mx-auto w-full">
          {/* Hero text skeleton */}
          <div className="space-y-2 mb-8">
             <Skeleton className="h-10 w-48 rounded-xl" />
             <Skeleton className="h-5 w-72 rounded-lg" />
          </div>

          {/* Create Issue Input Skeleton */}
          <Skeleton className="h-32 w-full rounded-2xl" />
          
          {/* Filters Skeleton */}
          <div className="flex gap-2">
             <Skeleton className="h-10 w-24 rounded-full" />
             <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          {/* Feed Items Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
