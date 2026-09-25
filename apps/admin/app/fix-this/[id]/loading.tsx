import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";
import { Skeleton } from "@onlystartups/ui";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative">
      <Navbar />

      {/* Subtle ambient light accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[55vw] h-[55vw] bg-[#F26522]/5 rounded-full blur-[130px]" />
        <div className="absolute top-[40%] left-[-10%] w-[45vw] h-[45vw] bg-[#1A1A2E]/5 rounded-full blur-[110px]" />
      </div>

      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4 mb-8">
             <div className="flex gap-2 mb-4">
               <Skeleton className="h-6 w-20 rounded-full" />
               <Skeleton className="h-6 w-24 rounded-full" />
             </div>
             <Skeleton className="h-12 w-3/4 rounded-xl" />
             <div className="flex items-center gap-4 mt-4">
               <Skeleton className="h-10 w-10 rounded-full shrink-0" />
               <div className="space-y-2">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-3 w-24" />
               </div>
             </div>
          </div>

          {/* Image/Video Placeholder Skeleton */}
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          
          {/* Content Body Skeleton */}
          <div className="space-y-4">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[90%]" />
             <Skeleton className="h-4 w-[95%]" />
             <Skeleton className="h-4 w-[80%]" />
             <Skeleton className="h-4 w-[85%]" />
          </div>
          
          <div className="space-y-4 pt-8">
             <Skeleton className="h-4 w-[92%]" />
             <Skeleton className="h-4 w-[88%]" />
             <Skeleton className="h-4 w-[94%]" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
