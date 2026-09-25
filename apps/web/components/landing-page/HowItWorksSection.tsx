"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Challenge Identification",
    description: "Government departments use standard templates to formulate and publish outcome-based problem statements.",
  },
  {
    title: "Discovery & Screening",
    description: "Innovative startups apply directly. Mentors and domain experts evaluate the novel technologies for eligibility.",
  },
  {
    title: "Sandbox & Pilot",
    description: "Selected startups enter a controlled pilot phase governed by clear IP clauses and milestone-based contracting.",
  },
  {
    title: "Scale-up & Procurement",
    description: "Performance is independently validated, payments are released, and successful pilots are scaled across districts.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-8 md:px-10 lg:px-6 bg-[#1A1A2E] text-white relative z-10 overflow-hidden">


      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-[#F26522] font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-4">
            The Process
          </h2>
          <h3 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            How the <span className="font-serif font-normal italic text-[#F26522]">Mechanism</span> Works
          </h3>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            A structured end-to-end pathway ensuring transparent, competitive, and legally compliant innovation procurement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative flex flex-col p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.08] transition-all duration-500 overflow-hidden"
            >
              {/* Massive Watermark Number */}
              <div className="absolute -top-6 -right-6 text-[10rem] font-black text-white/[0.02] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:text-white/[0.04] leading-none">
                {idx + 1}
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4 mt-2">
                  <span className="inline-block text-[#F26522] font-mono text-sm font-bold tracking-widest mb-2 uppercase">
                    Step 0{idx + 1}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold leading-tight">{step.title}</h4>
                </div>
                
                <p className="text-white/50 text-sm sm:text-base leading-relaxed mt-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
