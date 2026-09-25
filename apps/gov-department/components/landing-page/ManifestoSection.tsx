"use client";

import { motion } from "framer-motion";

export default function ManifestoSection() {
  return (
    <section className="bg-[#1A1A2E] text-[#F5F5EE] py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-10 lg:px-6 relative z-20 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-sans font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Replace fragmented tools with a single <span className="text-[#F26522] italic font-serif font-normal">ecosystem.</span>
          </h2>
        </motion.div>

        <div className="space-y-5 sm:space-y-6 md:space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-snug opacity-90 font-medium max-w-4xl"
          >
            A unified shared workspace built to streamline how startup hubs manage founders and scale their programs.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 border-t border-[#F5F5EE]/10 pt-4 sm:pt-5 md:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-sm sm:text-base md:text-lg opacity-70 leading-relaxed font-light">
                Establish your program with confidence using our professional-grade SMS. Standardize your curriculum while maintaining the flexibility to manage unique startup lifecycles at scale.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-sm sm:text-base md:text-lg opacity-70 leading-relaxed font-light">
                OnlyStartups consolidates CRM, milestone tracking, curriculum delivery, and founder tools into one operational backbone so nothing slips through the cracks.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
