import React from 'react';
import { Target, Eye } from 'lucide-react';
import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";
import AboutHero from "@/components/about/AboutHero";

export const metadata = {
  title: "About OnlyStartups | Empowering Entrepreneurs",
};

export default function AboutPage() {
  return (
    <PublicLayoutWrapper>
      <div className="flex-grow pt-16 sm:pt-24 pb-16 relative z-10">



        {/* Hero Section */}
        <AboutHero />

        {/* Story Section */}
        <section className="relative py-6 sm:py-10 md:py-12 z-10 px-4 sm:px-8 md:px-10 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <p className="font-sans font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1A2E] tracking-tight mb-4 leading-tight">
                Helping every <span className="font-serif font-normal italic text-[#F26522]">founder succeed.</span>
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 text-[#1A1A2E]/80 text-base sm:text-lg leading-relaxed font-medium text-justify">
                <p>
                  As founders in India, we know how hard it is to build a startup. We have faced the same problems and understand the struggles of starting a company from scratch.
                </p>
                <p>
                  To solve this, we built <span className="font-bold text-[#1A1A2E]">OnlyStartups</span> It is a platform that connects startups with the right tools, grants, and mentors across India. Whether you need funding, guidance, or services, we help you find them easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="relative py-6 sm:py-10 md:py-12 z-10 px-4 sm:px-8 md:px-10 lg:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-[#F26522] font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-4">
                Our Core
              </h2>
            </div>

            <div className="flex flex-col space-y-12 sm:space-y-16">
              {/* Mission Section */}
              <div className="flex flex-col">
                <h3 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] tracking-tight mb-4 sm:mb-6">
                  Mission <span className="font-serif font-normal italic text-[#F26522]">OnlyStartups</span>
                </h3>
                <p className="text-[#1A1A2E]/80 text-base sm:text-lg leading-relaxed font-medium text-justify">
                  To empower startup hubs and founders with a shared workspace that brings people, ideas, and opportunities together. We aim to simplify collaboration, streamline startup management, and help startup communities build, connect, and grow more effectively.
                </p>
              </div>

              {/* Vision Section */}
              <div className="flex flex-col">
                <h3 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] tracking-tight mb-4 sm:mb-6">
                  Vision <span className="font-serif font-normal italic text-[#F26522]">OnlyStartups</span>
                </h3>
                <p className="text-[#1A1A2E]/80 text-base sm:text-lg leading-relaxed font-medium text-justify">
                  To create a connected startup ecosystem where startup hubs and founders collaborate seamlessly. We envision a future where every founder has access to the right tools, network, and support to turn ideas into successful ventures and contribute to a thriving entrepreneurial ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayoutWrapper>
  );
}
