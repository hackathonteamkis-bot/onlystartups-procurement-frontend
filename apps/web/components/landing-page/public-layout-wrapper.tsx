import React from 'react';
import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow relative z-10 w-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
