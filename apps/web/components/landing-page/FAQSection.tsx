"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is OnlyStartups?",
    answer:
      "OnlyStartups is an integrated platform connecting startup hubs (accelerators, incubators) with founders. We provide the operational infrastructure for hubs to manage their programs, and the strategic tools founders need to build from day zero.",
  },
  {
    question: "What tools are provided for Startup Hubs?",
    answer:
      "We offer a complete shared workspace for program management. Hubs can streamline venture intake, deliver standardized curriculum via SMS, track milestones, and manage grants all from a single dashboard.",
  },
  {
    question: "What resources are available for Founders?",
    answer:
      "Founders gain access to a curated network of startup hubs, actionable playbooks, real-time equity management, and a centralized directory of grants and events to accelerate their growth.",
  },
  {
    question: "Is OnlyStartups free to use?",
    answer:
      "We offer a comprehensive free tier for early-stage founders and new startup hubs. As your operations scale, we provide premium tiers with advanced CRM capabilities and custom integrations.",
  },
  {
    question: "How do I get started?",
    answer:
      "Whether you're a founder looking to launch or a hub looking to scale, you can request access directly through our portal. Once approved, you'll join an exclusive, high-signal network tailored to your goals.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-10 lg:px-6 bg-[#F5F5EE]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-[#F26522] font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3 sm:mb-4">
            FAQ
          </h2>
          <h3 className="font-sans font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#1A1A2E]">
            Common <span className="font-serif font-normal italic">questions.</span>
          </h3>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="border-b border-[#1A1A2E]/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full py-5 sm:py-6 md:py-8 flex items-center justify-between text-left group"
              >
                <h3 className="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-[#1A1A2E] group-hover:text-[#F26522] transition-colors pr-4 sm:pr-8">
                  {faq.question}
                </h3>
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#1A1A2E]/10 flex items-center justify-center transition-all duration-300 ${openIndex === idx ? "rotate-45 bg-[#F26522] border-[#F26522] text-white" : "group-hover:border-[#F26522]/30"
                    }`}
                >
                  <Plus className={`w-4 h-4 sm:w-5 sm:h-5 ${openIndex === idx ? "text-white" : "text-[#1A1A2E]/40"}`} />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 sm:pb-8 md:pb-10 text-[#1A1A2E]/60 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
