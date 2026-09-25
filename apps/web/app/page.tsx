import HeroSection from "@/components/landing-page/HeroSection";
import HowItWorksSection from "@/components/landing-page/HowItWorksSection";
import InteractiveFlowSection from "@/components/landing-page/InteractiveFlowSection";
import ExpectedOutcomesSection from "@/components/landing-page/ExpectedOutcomesSection";
import FAQSection from "@/components/landing-page/FAQSection";
import CTASection from "@/components/landing-page/CTASection";
import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";

export default function Home() {
  return (
    <PublicLayoutWrapper>
      <HeroSection />
      <HowItWorksSection />
      <InteractiveFlowSection />
      <ExpectedOutcomesSection />
      <FAQSection />
      <CTASection />
    </PublicLayoutWrapper>
  );
}
