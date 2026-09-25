export const dynamic = "force-dynamic";

import { Navbar } from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/Footer";
import { IssueDetailContent } from "@/components/fix-this/issue-detail-content";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

export default async function FixThisDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  const issue = await getIssueDetails(id, session?.accessToken);

  if (!issue) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EE] relative">
      <Navbar />

      {/* Subtle ambient light accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[55vw] h-[55vw] bg-[#F26522]/5 rounded-full blur-[130px]" />
        <div className="absolute top-[40%] left-[-10%] w-[45vw] h-[45vw] bg-[#1A1A2E]/5 rounded-full blur-[110px]" />
      </div>

      <main className="flex-grow pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px] mx-auto w-full">
        <IssueDetailContent initialIssue={issue} />
      </main>

      <Footer />
    </div>
  );
}
