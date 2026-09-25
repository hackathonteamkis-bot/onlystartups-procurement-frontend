export const dynamic = "force-dynamic";

import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";
import { FeedContent } from "@/components/fix-this/feed-content";
import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getInitialIssues(token?: string): Promise<any[]> {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/fix-this?sort=popular`, {
      headers,
      next: { revalidate: 10 }, // Cache on server for 10 seconds
    });
    
    if (!res.ok) throw new Error("Failed to fetch initial issues");
    return await res.json();
  } catch (error) {
    console.error("Error fetching initial issues for FixThis:", error);
    return [];
  }
}

export default async function FixThisPage() {
  const session = await getSession();
  const initialIssues = await getInitialIssues(session?.accessToken);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative">
      <Navbar />

      {/* Subtle background radial ambient lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F26522]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#1A1A2E]/5 rounded-full blur-[140px]" />
      </div>

      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        <FeedContent initialIssues={initialIssues} />
      </main>

      <Footer />
    </div>
  );
}
