"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, BarChart3 } from "lucide-react";

const outcomes = [
  {
    icon: Zap,
    title: "Faster Discovery",
    description: "Drastically reduce the time it takes to find and test innovative solutions for departmental problems.",
  },
  {
    icon: ShieldCheck,
    title: "Reduced Departmental Risk",
    description: "Legally compliant workflows, independent validation, and standard IP clauses protect government interests.",
  },
  {
    icon: CheckCircle2,
    title: "Timely Startup Payments",
    description: "Clear milestone-based contracting ensures startups are paid on time, removing financial bottlenecks.",
  },
  {
    icon: BarChart3,
    title: "Evidence-Based Scaling",
    description: "Data-driven performance measurement allows successful pilots to be seamlessly scaled across districts.",
  },
];

export default function ExpectedOutcomesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-10 lg:px-6 bg-[#F5F5EE] relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-[#F26522] font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-3">
            Expected Outcomes
          </h2>
          <h3 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl text-[#1A1A2E] tracking-tight">
            Built for <span className="font-serif font-normal italic text-[#F26522]">Impact</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {outcomes.map((outcome, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-start gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-[#1A1A2E]/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#F26522]/10 text-[#F26522] flex items-center justify-center">
                <outcome.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#1A1A2E] mb-2">{outcome.title}</h4>
                <p className="text-[#1A1A2E]/70 text-sm leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
