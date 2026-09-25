import { Skeleton } from "@onlystartups/ui";

export default function ExploreLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-black/5" />
        <Skeleton className="h-4 w-64 bg-black/5" />
      </div>
      <div className="space-y-6">
        {/* Tabs Skeleton */}
        <div className="flex gap-2 border-b border-border pb-px">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-t-lg bg-black/5" />
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-full max-w-md rounded-lg bg-black/5" />
          <Skeleton className="h-10 w-24 rounded-lg bg-black/5" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-6 space-y-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-12 w-12 rounded-full bg-black/5" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-5 w-3/4 bg-black/5" />
                  <Skeleton className="h-4 w-1/2 bg-black/5" />
                </div>
              </div>
              <Skeleton className="h-20 w-full bg-black/5" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-20 rounded-full bg-black/5" />
                <Skeleton className="h-8 w-8 rounded-full bg-black/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
