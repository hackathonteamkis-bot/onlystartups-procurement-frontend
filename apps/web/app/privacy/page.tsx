import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";

export default function PrivacyPolicy() {
  return (
    <PublicLayoutWrapper>
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-sans font-semibold text-[#1A1A2E]">
              Privacy Policy
            </h1>
            <p className="text-[#1A1A2E]/60">Last updated: January 17, 2026</p>
          </div>

          <section className="space-y-6 text-[#1A1A2E]/80 leading-relaxed text-justify">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                1. Introduction
              </h2>
              <p>
                Welcome to OnlyStartups (http://localhost:3000/). We are committed to
                protecting your personal information and your right to privacy.
                If you have any questions or concerns about our policy, or our
                practices with regards to your personal information, please
                contact us at hackathon.teamkis@gmail.com.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                2. Information We Collect
              </h2>
              <p>
                We collect personal information that you voluntarily provide to
                us when registering at the Website, expressing an interest in
                obtaining information about us or our products and services,
                when participating in activities on the Website or otherwise
                contacting us.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                3. How We Use Your Information
              </h2>
              <p>
                We use personal information collected via our Website for a
                variety of business purposes described below. We process your
                personal information for these purposes in reliance on our
                legitimate business interests, in order to enter into or perform
                a contract with you, with your consent, and/or for compliance
                with our legal obligations.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                4. Data Security
              </h2>
              <p>
                We have implemented appropriate technical and organizational
                security measures designed to protect the security of any
                personal information we process. However, please also remember
                that we cannot guarantee that the internet itself is 100%
                secure.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                5. Contact Us
              </h2>
              <p>
                If you have questions or comments about this policy, you may
                email us at hackathon.teamkis@gmail.com.
              </p>
            </div>
          </section>
        </div>
      </main>
    </PublicLayoutWrapper>
  );
}
