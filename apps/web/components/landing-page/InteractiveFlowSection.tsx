"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Building2, Rocket, Network, CheckCircle } from "lucide-react";

const flowSteps = [
  {
    id: 1,
    title: "Government Department",
    subtitle: "Problem Identification",
    description: "Departments use standardized templates to publish outcome-based challenges instead of rigid specifications.",
    icon: Building2,
    color: "from-[#F26522] to-[#ff8547]",
    shadow: "shadow-[#F26522]/30",
    align: "left"
  },
  {
    id: 2,
    title: "OnlyStartups Platform",
    subtitle: "Screening & Matching",
    description: "Mentors and domain experts evaluate novel technologies for eligibility and fit against the problem statements.",
    icon: Network,
    color: "from-[#F26522] to-[#ff8547]",
    shadow: "shadow-[#F26522]/30",
    align: "right"
  },
  {
    id: 3,
    title: "Innovative Startup",
    subtitle: "Sandbox & Pilot",
    description: "Selected startups enter a controlled pilot phase with clear milestone-based contracting and IP protection.",
    icon: Rocket,
    color: "from-[#F26522] to-[#ff8547]",
    shadow: "shadow-[#F26522]/30",
    align: "left"
  },
  {
    id: 4,
    title: "Final Procurement",
    subtitle: "Validation & Scale",
    description: "Performance is independently validated, final payments are released, and successful solutions scale across districts.",
    icon: CheckCircle,
    color: "from-[#1A1A2E] to-[#2a2a4a]",
    shadow: "shadow-[#1A1A2E]/30",
    align: "right"
  }
];

export default function InteractiveFlowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Map scroll progress to the height of the glowing line
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 sm:py-32 px-4 sm:px-8 md:px-10 bg-[#F5F5EE] text-[#1A1A2E] relative z-10 overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#1A1A2E]/10 to-transparent" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#F26522]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#F26522]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-20 sm:mb-32">
          <h2 className="text-[#F26522] font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-4">
            The Procurement Ecosystem
          </h2>
          <h3 className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1A1A2E]">
            From <span className="text-[#F26522] italic font-serif font-normal">Problem</span> to <span className="text-[#F26522] italic font-serif font-normal">Procurement</span>
          </h3>
          <p className="mt-6 text-[#1A1A2E]/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Follow the journey of a public problem statement as it flows through our secure, transparent ecosystem—connecting government needs with startup innovation.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Static Track Background */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-1 sm:-translate-x-1/2 bg-[#1A1A2E]/10 rounded-full" />
          
          {/* Animated Glowing Track */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-8 sm:left-1/2 top-0 w-1 sm:-translate-x-1/2 bg-gradient-to-b from-[#F26522]/20 via-[#F26522] to-[#1A1A2E] rounded-full origin-top z-10"
          >
             {/* Glowing Ball at the tip of the line */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#F26522] rounded-full shadow-[0_0_15px_4px_rgba(242,101,34,0.4)]" />
          </motion.div>

          <div className="space-y-16 sm:space-y-32 pb-10 relative z-10">
            {flowSteps.map((step, idx) => {
              const isLeft = step.align === "left";
              
              return (
                <div key={step.id} className={`relative flex items-center ${isLeft ? 'sm:justify-start' : 'sm:justify-end'} pl-20 sm:pl-0`}>
                  
                  {/* Central Node Icon */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#F5F5EE] border-[6px] border-[#F5F5EE] z-20 flex items-center justify-center shadow-md"
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} ${step.shadow} flex items-center justify-center p-3 sm:p-4 shadow-lg`}>
                      <step.icon className="w-full h-full text-white drop-shadow-md" strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`w-full sm:w-[45%] ${isLeft ? 'sm:pr-16' : 'sm:pl-16'}`}
                  >
                    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#1A1A2E]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                      
                      {/* Subtle hover gradient inside card */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br ${step.color}`} />

                      <div className="relative z-10">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-black/5 text-[#1A1A2E]/70 border border-[#1A1A2E]/10`}>
                          {step.subtitle}
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold mb-3 text-[#1A1A2E]">{step.title}</h4>
                        <p className="text-[#1A1A2E]/70 text-sm sm:text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}
