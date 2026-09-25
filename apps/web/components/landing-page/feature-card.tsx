"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FeatureCardProps {
    overline?: string;
    title?: string;
    subtitle?: string;
    features: string[];
    theme: "light" | "dark";
}

export default function FeatureCard({
    overline,
    title,
    subtitle,
    features,
    theme,
}: FeatureCardProps) {
    const isDark = theme === "dark";

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className={`relative w-full h-full rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-500 flex flex-col ${isDark
                ? "bg-[#1A1A2E] text-white"
                : "bg-white text-[#1A1A2E] border border-[#1A1A2E]/5"
                } shadow-[0_4px_20px_rgba(0,0,0,0.02)] sm:shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]`}
        >
            {(overline || title || subtitle) && (
                <div className="mb-3 md:mb-4 text-left">
                    {overline && (
                        <h4 className="text-[#F26522] font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3">
                            {overline}
                        </h4>
                    )}
                    {title && (
                        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-tight mb-2 sm:mb-3">
                            <span className="italic">{title}</span>
                        </h3>
                    )}
                    {subtitle && (
                        <p
                            className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-white/70" : "text-[#1A1A2E]/70"
                                }`}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className={`mt-auto space-y-2 sm:space-y-3 text-left ${(overline || title || subtitle) ? 'pt-1 sm:pt-2' : ''}`}>
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <Check strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5 text-[#F26522] shrink-0 mt-[2px]" />
                        <span
                            className={`text-xs sm:text-sm font-medium ${isDark ? "text-white/80" : "text-[#1A1A2E]/80"
                                }`}
                        >
                            {feature}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
