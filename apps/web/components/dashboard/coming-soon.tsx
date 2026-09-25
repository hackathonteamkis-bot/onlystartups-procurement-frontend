"use client";

import { LucideIcon } from "lucide-react";
import { Badge } from "@onlystartups/ui";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: ComingSoonProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-md w-full bg-white border border-[#1A1A2E]/5 rounded-xl p-12 text-center space-y-6 shadow-sm">
        <div className="bg-[#F5F5EE] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-[#1A1A2E]/40" />
        </div>

        <div className="space-y-4">
          <Badge className="bg-[#1A1A2E]/5 text-[#1A1A2E]/60 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-0.5">
            Coming Soon
          </Badge>
          <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">
            {title}
          </h1>
          <p className="text-[#1A1A2E]/60 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <button
          disabled
          className="w-full bg-[#1A1A2E] text-white font-bold uppercase tracking-widest px-6 py-4 rounded-full text-xs opacity-50 cursor-not-allowed"
        >
          Notifications Coming Soon
        </button>
      </div>
    </div>
  );
}
