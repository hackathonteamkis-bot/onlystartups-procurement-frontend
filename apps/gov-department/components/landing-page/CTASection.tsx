"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-10 lg:px-6 relative overflow-hidden bg-[#F5F5EE]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto relative group"
      >
        <div className="relative bg-[#1A1A2E] rounded-2xl sm:rounded-xl px-4 sm:px-8 py-10 sm:py-16 md:py-20 text-center overflow-hidden border border-white/10 shadow-2xl">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#1A1A2E] to-[#2a2a4e]" />
          
          {/* Noise effect */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              filter: "contrast(145%) brightness(650%) invert(100%)",
              mixBlendMode: "screen",
              opacity: 0.8,
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-sans font-semibold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#F5F5EE] leading-[1.1] mb-6 sm:mb-8 tracking-tight text-balance">
              Ready to shape India&apos;s <span className="font-serif font-normal italic text-[#F26522]">startup ecosystem?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-[#1A1A2E] font-bold text-sm sm:text-base text-center transition-all duration-300"
              >
                Join as Founder
              </Link>
              <Link
                href="https://onlystartups-gov.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-[#F26522] text-white rounded-full font-bold text-sm sm:text-base text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#d95a1e]"
              >
                Join as Startuphub
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
