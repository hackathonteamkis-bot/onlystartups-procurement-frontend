"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Powerful Dashboard",
    description: "Get a bird's eye view of your entire startup ecosystem with our intuitive and comprehensive dashboard.",
    image: "/images/dash.png",
  },
  {
    title: "Unified User Database",
    description: "Manage founders, mentors, and investors in one centralized, intelligent database.",
    image: "/images/user-database.png",
  },
  {
    title: "Marketing Automation",
    description: "Streamline your outreach and campaigns with built-in marketing tools designed for high growth.",
    image: "/images/marketing.png",
  },
  {
    title: "Seamless Integrations",
    description: "Connect all your favorite tools. Our platform plays nicely with the software you already use.",
    image: "/images/integrations.png",
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-8 md:px-10 lg:px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-24 sm:space-y-32">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-12 lg:gap-16 items-center",
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-[#F26522] font-mono text-sm font-bold uppercase tracking-widest">
                    Feature 0{index + 1}
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl text-[#1A1A2E] leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[#1A1A2E]/60 text-lg sm:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {feature.description}
                </p>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 relative"
              >
                <div className="absolute inset-0 bg-[#F26522]/5 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
                <div className="relative rounded-2xl overflow-hidden border border-[#1A1A2E]/10 shadow-2xl bg-white">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
