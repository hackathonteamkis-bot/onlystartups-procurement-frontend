import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-sans font-semibold text-[#1A1A2E]">
              Terms of Service
            </h1>
            <p className="text-[#1A1A2E]/60">Last updated: January 17, 2026</p>
          </div>

          <section className="space-y-6 text-[#1A1A2E]/80 leading-relaxed text-justify">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using OnlyStartups (http://localhost:3000/), you agree to
                be bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this site.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on OnlyStartups&apos; website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                3. Disclaimer
              </h2>
              <p>
                The materials on OnlyStartups&apos; website are provided on an &apos;as
                is&apos; basis. OnlyStartups makes no warranties, expressed or implied,
                and hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                4. Limitations
              </h2>
              <p>
                In no event shall OnlyStartups or its suppliers be liable for any damages
                (including, without limitation, damages for loss of data or
                profit, or due to business interruption) arising out of the use
                or inability to use the materials on OnlyStartups&apos; website.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#1A1A2E]">
                5. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of India and you irrevocably submit to
                the exclusive jurisdiction of the courts in that State or
                location.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
