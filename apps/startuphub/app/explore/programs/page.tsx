export const dynamic = "force-dynamic";
import { getAllPublicPrograms } from "@/actions/explore";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@onlystartups/ui";
import { 
  Building2, 
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { ProgramsListingClient } from "./programs-listing-client";

export default async function ExploreProgramsPage() {
  const programs = await getAllPublicPrograms();
  
  if (!Array.isArray(programs) && "error" in programs) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#1A1A2E]/60">{programs.error || 'Failed to fetch programs'}</p>
      </div>
    );
  }

  const activeProgramsCount = Array.isArray(programs) ? programs.filter((c: any) => c.status === 'INTAKE').length : 0;
  const programsList = Array.isArray(programs) ? programs : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <Link
          href="/explore"
          className="text-xs font-bold text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors uppercase tracking-widest w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Explore
        </Link>
        <PageHeader
          title="Programs"
          description="Discover and apply to incubator and accelerator programs."
        />
      </div>

      <div className="pt-2">
        <ProgramsListingClient initialPrograms={programsList} />
      </div>
    </div>
  );
}
