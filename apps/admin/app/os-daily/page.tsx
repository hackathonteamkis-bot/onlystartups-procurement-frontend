import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";
import { DateSelector } from "@/components/landing-page/date-selector";
import { PageTransition } from "@/components/landing-page/page-transition";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Calendar, IndianRupee, ListChecks, ArrowRight, ArrowLeft as PaginationPrev, ExternalLink, MapPin, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@onlystartups/ui";

interface OsDailyArticle {
  id: string;
  date: string;
  title: string;
  url: string;
  source: string;
  isFunding: boolean;
  startupName?: string;
  amount?: string;
  createdAt: string;
}

interface OsDailyResponse {
  fundingHighlights: OsDailyArticle[];
  generalNews: OsDailyArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Get today's date in IST format (YYYY-MM-DD)
function getTodayIST(): string {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(Date.now() + istOffset);
  return istDate.toISOString().split("T")[0];
}

// Validate date string matches YYYY-MM-DD and is a valid calendar date
function isValidDateString(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

// Generate calendar date range around the active date (capped at today)
function generateDateRange(activeDateStr: string): string[] {
  const activeDate = isValidDateString(activeDateStr) ? new Date(activeDateStr) : new Date();
  const dates: string[] = [];
  
  for (let i = -7; i <= 7; i++) {
    const d = new Date(activeDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dStr = d.toISOString().split("T")[0];
    dates.push(dStr);
  }
  
  return Array.from(new Set(dates)).sort();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getNewsForDate(date: string, page: string): Promise<OsDailyResponse | null> {
  if (!isValidDateString(date)) return null;
  
  try {
    const res = await fetch(`${API_URL}/os-daily?date=${date}&page=${page}&limit=10`, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return data as OsDailyResponse;
  } catch (error) {
    console.error(`Error fetching news for ${date}:`, error);
    return null;
  }
}

function NewsFeedSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <section>
        <div className="flex items-center gap-3 mb-6">
           <Skeleton className="w-10 h-10 rounded-lg bg-black/10" />
           <Skeleton className="h-8 w-48 rounded-lg bg-black/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[...Array(4)].map((_, i) => (
             <Skeleton key={i} className="h-32 rounded-xl bg-black/10" />
           ))}
        </div>
      </section>
      <section>
        <div className="flex items-center gap-3 mb-6">
           <Skeleton className="w-10 h-10 rounded-lg bg-black/10" />
           <Skeleton className="h-8 w-48 rounded-lg bg-black/10" />
        </div>
        <div className="space-y-4">
           {[...Array(5)].map((_, i) => (
             <Skeleton key={i} className="h-28 rounded-xl bg-black/10" />
           ))}
        </div>
      </section>
    </div>
  );
}

async function NewsFeed({ date, page }: { date: string, page: string }) {
  const data = await getNewsForDate(date, page);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 border border-border rounded-xl bg-card">
        <p className="text-muted-foreground font-medium">Failed to load news.</p>
      </div>
    );
  }

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("ellipsis-1");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("ellipsis-2");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-12">
      {/* Funding Raises */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <IndianRupee className="w-6 h-6 text-[#F26522]" />
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Funding Raises
          </h2>
        </div>
        {data.fundingHighlights.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 border-t border-border/50 pt-6">
            {data.fundingHighlights.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl bg-white/60 shadow-sm gap-2 sm:gap-3"
              >
                <div className="flex flex-col gap-1 w-full">
                  <span className="font-bold text-base sm:text-lg text-[#1A1A2E] leading-tight line-clamp-2">{item.startupName}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#F26522]/10 text-[#F26522] font-semibold text-xs sm:text-sm whitespace-nowrap self-start">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-dashed border-border/50 bg-card/20 text-muted-foreground text-sm">
            No funding rounds reported.
          </div>
        )}
      </section>

      {/* General News (Merged Dose & Nibbles) */}
      <section id="highlights" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <ListChecks className="w-6 h-6 text-[#F26522]" />
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Today&apos;s Highlights
          </h2>
        </div>

        {data.generalNews.length > 0 ? (
          <div className="flex flex-col border-t border-border/50">
            {data.generalNews.map((news, idx) => (
              <div 
                key={news.id} 
                className="flex items-start gap-4 py-5 border-b border-border/50 px-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#F26522]/10 text-[#F26522] flex items-center justify-center font-medium text-xs shrink-0">
                  {String((data.pagination.page - 1) * 10 + idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-[17px] font-medium text-[#1A1A2E]/80">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground">
            No startup news processed for this day yet.
          </div>
        )}
      </section>
      
      {/* Pagination Controls */}
      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="!mt-8 pb-4 flex justify-center">
          <ul className="flex flex-row items-center gap-1">
            <li>
              <Link
                href={data.pagination.page > 1 ? `/os-daily?date=${date}&page=${data.pagination.page - 1}#highlights` : "#"}
                className={`gap-1 px-2.5 sm:pl-2.5 flex items-center justify-center rounded-md h-9 text-sm font-medium transition-all ${
                  data.pagination.page <= 1 
                    ? "pointer-events-none opacity-40 cursor-not-allowed select-none text-[#1A1A2E]/50" 
                    : "cursor-pointer text-[#1A1A2E] hover:text-[#F26522] transition-colors"
                }`}
              >
                <PaginationPrev className="w-4 h-4" />
                <span className="hidden sm:block">Previous</span>
              </Link>
            </li>

            {getPageNumbers(data.pagination.page, data.pagination.totalPages).map((page, idx) => {
              if (typeof page === "string" && page.startsWith("ellipsis")) {
                return (
                  <li key={`ellipsis-${idx}`}>
                    <span className="flex size-9 w-9 h-9 items-center justify-center text-[#1A1A2E]/40">
                      <MoreHorizontal className="size-4" />
                    </span>
                  </li>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === data.pagination.page;
              return (
                <li key={pageNum}>
                  <Link
                    href={`/os-daily?date=${date}&page=${pageNum}#highlights`}
                    className={`cursor-pointer transition-all w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90"
                        : "text-[#1A1A2E]/70 hover:text-[#F26522] hover:bg-[#F26522]/5"
                    }`}
                  >
                    {pageNum}
                  </Link>
                </li>
              );
            })}

            <li>
              <Link
                href={data.pagination.page < data.pagination.totalPages ? `/os-daily?date=${date}&page=${data.pagination.page + 1}#highlights` : "#"}
                className={`gap-1 px-2.5 sm:pr-2.5 flex items-center justify-center rounded-md h-9 text-sm font-medium transition-all ${
                  data.pagination.page >= data.pagination.totalPages 
                    ? "pointer-events-none opacity-40 cursor-not-allowed select-none text-[#1A1A2E]/50" 
                    : "cursor-pointer text-[#1A1A2E] hover:text-[#F26522] transition-colors"
                }`}
              >
                <span className="hidden sm:block">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ date?: string; page?: string }>;
}

export default async function OSDailyPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const todayIST = getTodayIST();
  
  // Validate input query date
  let activeDate = resolvedParams.date || todayIST;
  if (!isValidDateString(activeDate)) {
    activeDate = todayIST;
  }
  
  const pageStr = resolvedParams.page || "1";
  const dateRange = generateDateRange(activeDate);

  const displayDate = new Date(activeDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative font-sans text-foreground selection:bg-primary/20">
      <Navbar />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F26522]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/5 rounded-full blur-[140px]" />
      </div>

      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        {/* Date Selector */}
        <div className="mt-8 mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <DateSelector 
            dates={dateRange} 
            activeDate={activeDate} 
            today={todayIST}
            baseUrl="/os-daily"
          />
        </div>

        {/* Content with Smooth Transition */}
        <PageTransition transitionKey={`${activeDate}-${pageStr}`}>
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              OS Daily: {displayDate}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Your daily digest of the most important startup news, funding rounds, and updates from the Indian ecosystem.
            </p>
          </div>

          <Suspense fallback={<NewsFeedSkeleton />}>
            <NewsFeed date={activeDate} page={pageStr} />
          </Suspense>
        </PageTransition>

      </main>

      <Footer />
    </div>
  );
}
