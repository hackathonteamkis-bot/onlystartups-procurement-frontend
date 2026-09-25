"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle parallax for the whole screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[70vh] flex flex-col items-center justify-center text-center z-10 px-4 sm:px-8 md:px-10 lg:px-6 py-12 sm:py-16 overflow-hidden">
      {/* Immersive Background System */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/5 rounded-full blur-[100px]" />

        {/* Grid Pattern Background with Mask */}
        <div
          className="absolute inset-0 z-0 opacity-10 sm:opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          }}
        />
      </div>

      {/* Top Fade Dissolve */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-[#F5F5EE] pointer-events-none z-0" />

      {/* Bottom Fade Dissolve */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#F5F5EE] pointer-events-none z-0" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="max-w-6xl mx-auto w-full space-y-5 sm:space-y-8 md:space-y-10 lg:space-y-12 pt-4 sm:pt-0 relative z-10"
      >
        <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#1A1A2E]/10 bg-white/50 backdrop-blur-md mb-2 sm:mb-4 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26522] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F26522]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/70">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[clamp(2.5rem,6.5vw,9rem)] font-semibold tracking-tighter leading-[1.1] sm:leading-[0.95] lg:leading-[0.9] text-[#1A1A2E]"
          >
            <span className="block sm:whitespace-nowrap">About</span>
            <span className="block sm:whitespace-nowrap">
              <span className="font-serif font-normal italic inline-block text-[#F26522]">OnlyStartups</span>
            </span>
          </motion.h1>


        </div>
      </motion.div>

    </section>
  );
}
