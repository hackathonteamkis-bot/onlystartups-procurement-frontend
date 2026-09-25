"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
  theme: "light" | "dark";
  exploreText: string;
}

export default function RoleCard({
  title,
  subtitle,
  imageSrc,
  href,
  theme,
  exploreText,
}: RoleCardProps) {
  const isDark = theme === "dark";

  return (
    <Link href={href} className="group block w-full h-full">
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className={`relative w-full h-full min-h-[170px] sm:min-h-[190px] md:min-h-[220px] rounded-[1.2rem] sm:rounded-xl overflow-hidden flex flex-col justify-center p-5 sm:p-6 md:p-8 transition-all duration-500 ${
          isDark
            ? "bg-[#1A1A2E] text-white"
            : "bg-white text-[#1A1A2E] border border-[#1A1A2E]/5"
        } shadow-[0_4px_20px_rgba(0,0,0,0.02)] sm:shadow-[0_8px_30px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]`}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={`object-cover transition-all duration-1000 group-hover:scale-110 ${
              isDark ? "opacity-10 grayscale" : "opacity-20"
            }`}
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-r from-[#1A1A2E] via-[#1A1A2E]/90 to-transparent"
                : "bg-gradient-to-r from-white via-white/30 to-transparent"
            }`}
          />
        </div>

        {/* Content Box */}
        <div className="relative z-10 flex items-center justify-between w-full gap-3 sm:gap-4">
          <div className="flex-1 text-left">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 tracking-tight font-jakarta leading-tight">
              {title}
            </h3>
            <p
              className={`text-[10px] sm:text-xs md:text-sm lg:text-base mb-2 sm:mb-3 md:mb-4 font-medium max-w-[65%] sm:max-w-[75%] md:max-w-xs leading-relaxed ${
                isDark ? "text-white/50" : "text-[#1A1A2E]/50"
              }`}
            >
              {subtitle}
            </p>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#F26522] group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
              {exploreText}{" "}
              <span className="text-xs sm:text-sm md:text-base">→</span>
            </div>
          </div>

          {/* Icon Circle */}
          <div
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full transition-all duration-500 shadow-md sm:shadow-lg bg-[#F26522] text-white group-hover:bg-[#d9561a] group-hover:scale-105`}
          >
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
