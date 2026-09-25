"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    label: "Education",
    title: "Startup Hub SMS.",
    description:
      "Professional-grade startup management system to educate and scale next-gen founders with mission-critical curriculum.",
    comingSoon: false,
  },
  {
    number: "02",
    label: "Community",
    title: "Event hosting.",
    description:
      "A specialized coordination hub for hosting curated meetups and workshops with integrated RSVP management and attendee vetting.",
    comingSoon: false,
  },
  {
    number: "03",
    label: "AI-Powered",
    title: "AI-driven matching.",
    description:
      "An AI-driven alignment engine that connects founders based on shared business logic and long-term strategic vision.",
    comingSoon: true,
  },
  {
    number: "04",
    label: "Partnerships",
    title: "Strategic partners.",
    description:
      "Connect and partner seamlessly across various industry verticals to unlock exclusive resources and opportunities.",
    comingSoon: true,
  },
  {
    number: "05",
    label: "Intelligence",
    title: "24/7 AI companions.",
    description:
      "24/7 strategic co-pilots providing context-aware guidance on financial modeling, hiring, and market entry.",
    comingSoon: true,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-10 lg:px-6 bg-[#F5F5EE]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-[#F26522] font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3 sm:mb-4">
            Ecosystem Tools
          </h2>
          <h3 className="font-sans font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#1A1A2E] max-w-3xl leading-tight">
            The unified <span className="font-serif font-normal italic">ecosystem.</span>
          </h3>
          <p className="mt-3 sm:mt-6 text-[#1A1A2E]/60 text-sm sm:text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            Every tool founders and startup hubs need to establish, manage, and scale, integrated into a single platform.
          </p>
        </motion.div>
 
        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group p-6 sm:p-8 rounded-2xl bg-white border border-[#1A1A2E]/10 hover:border-[#1A1A2E]/25 transition-all duration-300 flex flex-col h-full hover:shadow-[0_12px_40px_rgba(26,26,46,0.03)]"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-sm font-semibold text-[#1A1A2E]/40 group-hover:text-[#F26522] transition-colors duration-300">
                  {step.number}
                </span>
                <div className="flex items-center gap-2">
                  {step.comingSoon && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#F26522]/10 text-[#F26522] border border-[#F26522]/20">
                      Coming
                    </span>
                  )}
                  <span className="font-bold tracking-widest text-[10px] uppercase text-[#1A1A2E]/30 group-hover:text-[#1A1A2E]/60 transition-colors duration-300">
                    {step.label}
                  </span>
                </div>
              </div>
              <h4 className="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-[#1A1A2E] mb-3 leading-snug">
                {step.title}
              </h4>
              <p className="text-[#1A1A2E]/60 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
