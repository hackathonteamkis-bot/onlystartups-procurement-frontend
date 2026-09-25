"use client";

import { motion } from "framer-motion";

const logos = [
  "Y Combinator",
  "Techstars",
  "500 Startups",
  "Plug and Play",
  "Alchemist Accelerator",
  "MassChallenge",
  "Sequoia",
  "Andreessen Horowitz",
];

export default function SocialProofSection() {
  return (
    <section className="py-10 bg-[#F5F5EE] border-b border-[#1A1A2E]/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-sm font-semibold tracking-wider text-[#1A1A2E]/40 uppercase">
          Trusted by leading startup hubs and accelerators
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Gradient Masks for smooth fading at edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#F5F5EE] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#F5F5EE] to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex whitespace-nowrap gap-16 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {/* Duplicate the list to create a seamless infinite loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="text-[#1A1A2E]/30 font-bold text-xl md:text-2xl flex items-center justify-center shrink-0"
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
