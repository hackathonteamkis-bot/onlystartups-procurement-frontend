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
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-0 sm:px-4">
          {/* Back button skeleton */}
          <Skeleton className="h-4 w-40 mb-4" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                {/* Creator details header */}
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>

                {/* Title */}
                <Skeleton className="h-10 w-[85%] rounded-xl" />
                <Skeleton className="h-10 w-[60%] rounded-xl" />

                {/* Tags */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-6 w-32 rounded-md" />
                </div>

                {/* Body Content */}
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[95%]" />
                    <Skeleton className="h-4 w-[85%]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28 mb-2" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                </div>

                {/* Action Pills */}
                <div className="flex gap-3 pt-4 border-t border-[#1A1A2E]/5">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>

              {/* Comments Skeleton */}
              <div className="space-y-4 pt-6 border-t border-[#1A1A2E]/5">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                
                <div className="space-y-6 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[85%]" />
                        <div className="flex gap-2 mt-2">
                          <Skeleton className="h-6 w-16 rounded-md" />
                          <Skeleton className="h-6 w-12 rounded-md" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Recommendations) Skeleton */}
            <div className="lg:col-span-4 space-y-6 border-t lg:border-t-0 border-[#1A1A2E]/10 pt-6 lg:pt-0">
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-xl border border-[#1A1A2E]/5 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-[80%]" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-20 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                      </div>
                      <div className="flex justify-between pt-2 border-t border-[#1A1A2E]/5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
