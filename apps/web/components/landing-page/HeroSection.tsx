"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";


const RoleCard = dynamic(() => import("./role-card"), { ssr: false });
const FeatureCard = dynamic(() => import("./feature-card"), { ssr: false });

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle parallax for the whole screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="font-jakarta text-[#1A1A2E] bg-[#F5F5EE] relative overflow-x-hidden">


      {/* --- Screen 1: The Core Hero (min-h-screen) --- */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center z-10 px-4 sm:px-8 md:px-10 lg:px-6 py-24 lg:py-0 overflow-hidden">
        {/* Immersive Background System */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#F26522]/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/5 rounded-full blur-[100px]" />

          {/* Grid Pattern Background with Mask */}
          <div
            className="absolute inset-0 z-0 opacity-10 sm:opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
            }}
          />
        </div>

        {/* Top Fade Dissolve */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-[#F5F5EE] pointer-events-none z-0" />

        {/* Bottom Fade Dissolve */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#F5F5EE] pointer-events-none z-0" />

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="max-w-6xl mx-auto w-full space-y-5 sm:space-y-8 md:space-y-10 lg:space-y-14 pt-4 sm:pt-0"
        >
          <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#1A1A2E]/10 bg-white/50 backdrop-blur-md mb-2 sm:mb-4"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26522] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F26522]"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/70">
                Maharashtra State Innovation Society
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-[clamp(2rem,6.5vw,9rem)] font-semibold tracking-tighter leading-[1.1] sm:leading-[0.95] lg:leading-[0.9] text-[#1A1A2E]"
            >
              <span className="block sm:whitespace-nowrap">Public Procurement</span>
              <span className="block sm:whitespace-nowrap">for{' '}
                <span className="font-serif font-normal italic inline-block text-[#F26522]">Govt Departments & Startups</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[92%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl text-[13px] sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#1A1A2E]/70 font-medium leading-relaxed mx-auto text-balance"
            >
              A transparent, competitive, and legally compliant innovation-procurement pathway enabling government departments to identify, pilot, procure, and scale solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center pt-2 sm:pt-4"
            >
              <Link
                href="https://chat.whatsapp.com/Ckr97fxzZ2J8PXJ66Onhst?s=cl&p=a&mlu=4"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 sm:px-8 sm:py-3.5 bg-[#F26522] text-white rounded-full font-bold text-sm sm:text-base transition-all hover:bg-[#d95a1e] hover:shadow-lg active:scale-95 duration-300"
              >
                Join Community
              </Link>
            </motion.div>
          </div>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 opacity-30"
        >
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- Screen 2: Role Cards (Built for Both Sides) --- */}
      <section id="roles" className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-8 md:px-10 lg:px-6 z-10 bg-[#F5F5EE]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          >
            <h2 className="text-[#F26522] font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-3">
              Bridging the Gap
            </h2>
            <p className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#1A1A2E] tracking-tight leading-tight">
              Empowering Departments. <span className="font-serif font-normal italic text-[#F26522]">Scaling Startups.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <RoleCard
                title="For Government Departments"
                subtitle="Formulate outcome-based problem statements, discover suitable startups, and execute controlled pilots effortlessly."
                imageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                href="https://onlystartups-gov.vercel.app/"
                theme="light"
                exploreText="LEARN MORE"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <RoleCard
                title="For Innovative Startups"
                subtitle="Bypass long sales cycles, apply directly to government challenges, and secure milestone-based payments."
                imageSrc="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
                href="/auth/register"
                theme="dark"
                exploreText="LEARN MORE"
              />
            </motion.div>
          </div>

          <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 lg:items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full"
            >
              <FeatureCard
                title="End-to-End Mechanism."
                features={[
                  "Standardized problem statements",
                  "Expert evaluation & screening",
                  "Milestone-based contracting",
                  "Performance & validation tracking"
                ]}
                theme="dark"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full"
            >
              <FeatureCard
                title="Procurement Pathway."
                features={[
                  "Direct government access",
                  "Transparent eligibility criteria",
                  "Sandbox & pilot design",
                  "Scale-up opportunities"
                ]}
                theme="light"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
