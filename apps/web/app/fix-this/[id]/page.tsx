export const dynamic = "force-dynamic";

import { PublicLayoutWrapper } from "@/components/landing-page/public-layout-wrapper";
import { IssueDetailContent } from "@/components/fix-this/issue-detail-content";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onlystartups-api.vercel.app";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getIssueDetails(id: string, token?: string) {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/fix-this/${id}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch bottleneck details");
    }

    return await res.json();
  } catch (error) {
    console.error("Error loading bottleneck page:", error);
    return null;
  }
}

async function getRecommendations(excludeId: string) {
  try {
    const res = await fetch(`${API_URL}/fix-this`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const allIssues: any[] = await res.json();
    return allIssues.filter((i) => i.id !== excludeId).slice(0, 4);
  } catch (error) {
    console.error("Error loading recommendations:", error);
    return [];
  }
}

export default async function FixThisDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  
  const [issue, recommendations] = await Promise.all([
    getIssueDetails(id, session?.accessToken),
    getRecommendations(id),
  ]);

  if (!issue) {
    notFound();
  }

  return (
    <PublicLayoutWrapper>
      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        <IssueDetailContent initialIssue={issue} initialRecommendations={recommendations} />
      </main>
    </PublicLayoutWrapper>
  );
}
