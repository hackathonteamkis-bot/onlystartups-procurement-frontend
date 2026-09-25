import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider, BreadcrumbProvider } from "@onlystartups/ui";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";

interface ExploreLayoutProps {
  children: React.ReactNode;
}

export default async function ExploreLayout({
  children,
}: ExploreLayoutProps) {
  const session = await getSession();

  // If user is logged in, show the Dashboard layout
  if (session) {
    return (
      <BreadcrumbProvider>
        <SidebarProvider>
          <div className="flex flex-col lg:flex-row min-h-screen bg-[#1A1A2E]">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0 py-2 pr-2 pl-0 lg:py-3 lg:pr-3 lg:pl-0 h-[100dvh] overflow-hidden">
              <div className="flex-1 bg-[#F5F5EE] rounded-2xl border border-white/10 shadow-xl flex flex-col min-w-0 overflow-hidden relative">
                {/* Background gradient moved to the center page */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F26522]/10 rounded-full blur-[120px]" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/15 rounded-full blur-[140px]" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <DashboardHeader />
                  <main className="flex-1 min-w-0 overflow-y-auto px-2 sm:px-4 py-4 md:py-6">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </BreadcrumbProvider>
    );
  }

  // If user is not logged in, show the public landing page layout
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative">
      <Navbar />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F26522]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/15 rounded-full blur-[140px]" />
      </div>

      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}
