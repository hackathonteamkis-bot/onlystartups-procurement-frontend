"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Before OnlyStartups, managing 50+ founders was a nightmare of spreadsheets and emails. Now, our entire cohort lifecycle runs on autopilot.",
    author: "Sarah J.",
    role: "Program Director, TechLaunch Accelerator",
  },
  {
    quote: "The ability to track founder milestones and instantly see who needs help has completely transformed how we deliver value to our batches.",
    author: "Michael R.",
    role: "Managing Partner, Elevate Ventures",
  },
  {
    quote: "It's literally an operating system for incubators. The venture intake forms alone saved us weeks of manual data entry this season.",
    author: "Elena V.",
    role: "Operations Head, CampusHub",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-10 lg:px-6 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-[#F26522] font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3">
            Wall of Love
          </h2>
          <h3 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl text-[#1A1A2E] leading-tight">
            Trusted by top <span className="font-serif italic font-normal">programs.</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#F5F5EE] p-8 rounded-2xl relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#1A1A2E]/5" />
              <p className="text-[#1A1A2E]/80 text-base sm:text-lg font-medium leading-relaxed mb-8 relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center font-bold text-[#1A1A2E]/40 text-sm">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A1A2E] text-sm">{testimonial.author}</h4>
                  <p className="text-[#1A1A2E]/50 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
