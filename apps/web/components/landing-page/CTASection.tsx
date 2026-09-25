"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WebGLFluidGradient } from "./webgl-fluid-gradient";
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
        <div className="relative rounded-2xl px-4 sm:px-8 py-10 sm:py-16 md:py-20 text-center overflow-hidden">
          <WebGLFluidGradient theme="orange" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-sans font-semibold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1A1A2E] leading-[1.1] mb-6 sm:mb-8 tracking-tight text-balance">
              Ready to drive <span className="font-serif font-normal italic text-[#F26522]">innovation in governance?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-[#1A1A2E]/20 bg-transparent text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white font-bold text-sm sm:text-base text-center transition-all duration-300"
              >
                Join as a Startup
              </Link>
              <Link
                href="/departments"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-[#F26522] text-white rounded-full font-bold text-sm sm:text-base text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#d95a1e]"
              >
                Join as a Department
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
