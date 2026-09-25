export const dynamic = "force-dynamic";

import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";
import { FeedContent } from "@/components/fix-this/feed-content";
import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onlystartups-api.vercel.app";

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
    <PublicLayoutWrapper>
      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        <FeedContent initialIssues={initialIssues} />
      </main>
    </PublicLayoutWrapper>
  );
}
