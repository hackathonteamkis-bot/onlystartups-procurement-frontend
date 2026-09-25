"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@onlystartups/ui";
import { ArrowRight, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const images = [
  { src: "/images/dash.png", alt: "Dashboard" },
  { src: "/images/user-database.png", alt: "User Database" },
  { src: "/images/marketing.png", alt: "Marketing Automation" },
  { src: "/images/integrations.png", alt: "Integrations" },
];

export default function GovDepartmentsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  return (
    <section className="relative bg-[#1A1A2E] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-10 lg:px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F26522]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4 sm:space-y-6 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F26522] text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>For Government Departments</span>
          </div>

          <h2 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Source innovations with a <br className="hidden sm:block" />
            <span className="font-serif italic font-normal text-[#F26522]">unified portal.</span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Stop relying on conventional procurement for novel technologies. Formulate problem statements, evaluate novel solutions, structure controlled pilots, and manage IP seamlessly in one transparent platform.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="h-12 px-8 bg-[#F26522] hover:bg-[#F26522]/90 text-white font-semibold rounded-full text-base transition-all duration-300"
            >
              <Link href="/book-demo">
                Book a Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Feature Images Carousel */}
      <div className="mt-6 sm:mt-10 w-full mx-auto relative z-10 h-[250px] sm:h-[400px] md:h-[500px] lg:h-[550px] flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
        {images.map((img, idx) => {
          let diff = (idx - currentIndex) % images.length;
          if (diff < -images.length / 2) diff += images.length;
          if (diff > images.length / 2) diff -= images.length;
          
          // -1 (left), 0 (center), 1 (right), others hidden
          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isHidden = Math.abs(diff) > 1;

          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                x: isCenter ? "0%" : isLeft ? "-65%" : isRight ? "65%" : isLeft ? "-95%" : "95%",
                scale: isCenter ? 1 : isHidden ? 0.7 : 0.8,
                rotateY: isCenter ? 0 : isLeft ? 35 : isRight ? -35 : 0,
                zIndex: isCenter ? 30 : isHidden ? 10 : 20,
                opacity: isHidden ? 0 : 1,
              }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
              className="absolute w-full max-w-[280px] sm:max-w-[450px] md:max-w-[600px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setCurrentIndex(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
              />

            </motion.div>
          );
        })}
        
        {/* Navigation Buttons */}
        <button onClick={prev} className="absolute left-2 sm:left-12 md:left-24 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button onClick={next} className="absolute right-2 sm:right-12 md:right-24 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-[-30px] sm:bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-[#F26522]" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
