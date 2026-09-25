import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";
import { Skeleton } from "@onlystartups/ui";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative">
      <Navbar />
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#F26522]/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[50vw] h-[50vw] bg-[#1A1A2E]/5 rounded-full blur-[120px]" />
      </div>

      <main className="grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header Block Skeleton */}
        <div className="space-y-6 mb-8">
          <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50 gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A2E]/10 pb-6">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <Skeleton className="h-9 w-48 rounded-2xl" />
          </div>
        </div>

        {/* Date Selector Row Skeleton */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex gap-2 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-20 shrink-0 rounded-2xl" />
          ))}
        </div>

        {/* Staked Vertical sections Skeleton */}
        <div className="space-y-10 sm:space-y-12 lg:space-y-14">
          <section className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="divide-y divide-[#1A1A2E]/5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 py-4 sm:py-5">
                  <Skeleton className="w-6 h-6 rounded-full shrink-0 mt-1" />
                  <div className="space-y-2 grow">
                     <Skeleton className="h-5 w-full rounded-md" />
                     <Skeleton className="h-5 w-4/5 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>

      <Footer />
    </div>
  );
}
