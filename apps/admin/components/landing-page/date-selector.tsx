"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface DateSelectorProps {
  dates: string[];
  activeDate: string;
  today: string;
  baseUrl?: string;
}

export function DateSelector({ dates, activeDate, today, baseUrl = "/os-daily" }: DateSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticDate, setOptimisticDate] = useState(activeDate);

  // Sync server state when it finishes loading
  useEffect(() => {
    setOptimisticDate(activeDate);
  }, [activeDate]);

  const scrollToItem = (item: HTMLElement, container: HTMLElement) => {
    const containerWidth = container.clientWidth;
    const itemWidth = item.clientWidth;
    const itemOffsetLeft = item.offsetLeft;
    const scrollPosition = itemOffsetLeft - (containerWidth / 2) + (itemWidth / 2);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    });
  };

  // Initial scroll to active item
  useEffect(() => {
    if (containerRef.current) {
      const activeItem = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeItem) {
        scrollToItem(activeItem, containerRef.current);
      }
    }
  }, []);

  const handleDateClick = (dateStr: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (dateStr === optimisticDate) return;
    
    setOptimisticDate(dateStr);
    
    if (containerRef.current) {
       scrollToItem(e.currentTarget, containerRef.current);
    }
    
    startTransition(() => {
      router.push(`${baseUrl}?date=${dateStr}`);
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A2E]/40 px-1">
        Select Edition
      </label>
      <div 
        ref={containerRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((dateStr) => {
          const isActive = dateStr === optimisticDate;
          const isFuture = dateStr > today;
          const dateObj = new Date(dateStr);
          
          // Format date for display
          const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const dayMonth = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          
          if (isFuture) {
            return (
              <div
                key={dateStr}
                className="flex flex-col items-center min-w-[64px] sm:min-w-[72px] px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border text-center shrink-0 bg-[#1A1A2E]/5 border-[#1A1A2E]/5 text-[#1A1A2E]/30 cursor-not-allowed opacity-50 relative z-10"
              >
                <span className="text-[9px] uppercase tracking-wider font-medium opacity-60">
                  {weekday}
                </span>
                <span className="text-xs sm:text-sm mt-0.5 font-bold">
                  {dayMonth}
                </span>
              </div>
            );
          }
          
          return (
            <button
              key={dateStr}
              onClick={(e) => handleDateClick(dateStr, e)}
              data-active={isActive ? "true" : "false"}
              className={`flex flex-col items-center min-w-[64px] sm:min-w-[72px] px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border text-center shrink-0 relative z-10 transition-colors duration-300 ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-white/50 border-[#1A1A2E]/10 text-[#1A1A2E]/70 hover:bg-white/80 hover:border-[#1A1A2E]/20"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-date-pill"
                  className="absolute inset-0 bg-[#F26522] rounded-2xl shadow-sm z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`text-[9px] uppercase tracking-wider transition-opacity duration-300 ${isActive ? "opacity-100 font-bold" : "opacity-85 font-medium"}`}>
                {weekday}
              </span>
              <span className="text-xs sm:text-sm mt-0.5 font-bold">
                {dayMonth}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
