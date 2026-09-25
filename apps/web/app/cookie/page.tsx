import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";

export default function CookiePolicy() {
  return (
    <PublicLayoutWrapper>
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-sans font-semibold text-[#1A1A2E]">
              Cookie Policy
            </h1>
            <p className="text-[#1A1A2E]/60">Last updated: January 17, 2026</p>
          </div>

          <section className="space-y-6 text-[#1A1A2E]/80 leading-relaxed text-justify">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                1. What Are Cookies
              </h2>
              <p>
                As is common practice with almost all professional websites, this
                site uses cookies, which are tiny files that are downloaded to
                your computer, to improve your experience. This page describes what
                information they gather, how we use it, and why we sometimes need
                to store these cookies.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                2. How We Use Cookies
              </h2>
              <p>
                We use cookies for a variety of reasons detailed below.
                Unfortunately, in most cases, there are no industry standard
                options for disabling cookies without completely disabling the
                functionality and features they add to this site.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                3. Disabling Cookies
              </h2>
              <p>
                You can prevent the setting of cookies by adjusting the settings
                on your browser (see your browser Help for how to do this). Be
                aware that disabling cookies will affect the functionality of this
                and many other websites that you visit.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                4. Contact Us
              </h2>
              <p>
                If you have questions or comments about this policy, you may
                email us at info@onlystartups.app.
              </p>
            </div>
          </section>
        </div>
      </main>
    </PublicLayoutWrapper>
  );
}
