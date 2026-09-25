import HeroSection from "@/components/landing-page/HeroSection";
import StartupHubsSection from "@/components/landing-page/StartupHubsSection";
import FAQSection from "@/components/landing-page/FAQSection";
import CTASection from "@/components/landing-page/CTASection";
import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";

export default function Home() {
  return (
    <PublicLayoutWrapper>
      <HeroSection />
      <StartupHubsSection />
      <FAQSection />
      <CTASection />
    </PublicLayoutWrapper>
  );
}
