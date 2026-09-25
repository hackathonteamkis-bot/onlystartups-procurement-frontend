"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Badge, Input, Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@onlystartups/ui";
import { Building2, Search, LayoutGrid, List, Filter } from "lucide-react";

interface ProgramsListingClientProps {
  initialPrograms: any[];
}

export function ProgramsListingClient({ initialPrograms }: ProgramsListingClientProps) {
  const { status } = useSession();
  const router = useRouter();
  
  const requireAuth = (e: React.MouseEvent, callbackUrl: string) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.info("Please login to apply.");
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [showRecentlyOpened, setShowRecentlyOpened] = useState(false);
  const [showClosingSoon, setShowClosingSoon] = useState(false);

  // Extract unique organizations for the sidebar filter
  const organizations = useMemo(() => {
    const orgs = new Set<string>();
    initialPrograms.forEach((program) => {
      if (program.startupHub?.name) {
        orgs.add(program.startupHub.name);
      }
    });
    return Array.from(orgs).sort();
  }, [initialPrograms]);

  const durations = useMemo(() => {
    const durs = new Set<string>();
    initialPrograms.forEach((program) => {
      if (program.programDuration) {
        durs.add(program.programDuration);
      }
    });
    return Array.from(durs).sort();
  }, [initialPrograms]);

  const toggleOrg = (org: string) => {
    setSelectedOrgs((prev) =>
      prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]
    );
  };

  const toggleDuration = (duration: string) => {
    setSelectedDurations((prev) =>
      prev.includes(duration) ? prev.filter((d) => d !== duration) : [...prev, duration]
    );
  };

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((program) => {
      const matchesSearch = program.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            program.startupHub?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOrg = selectedOrgs.length === 0 || selectedOrgs.includes(program.startupHub?.name);
      const matchesDuration = selectedDurations.length === 0 || (program.programDuration && selectedDurations.includes(program.programDuration));
      
      let matchesRecentlyOpened = true;
      if (showRecentlyOpened) {
        if (program.applicationOpens) {
          const opens = new Date(program.applicationOpens);
          const now = new Date();
          const diffTime = now.getTime() - opens.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          matchesRecentlyOpened = diffDays >= 0 && diffDays <= 30; // within last 30 days
        } else {
          matchesRecentlyOpened = false;
        }
      }

      let matchesClosingSoon = true;
      if (showClosingSoon) {
        if (program.applicationDeadline) {
          const deadline = new Date(program.applicationDeadline);
          const now = new Date();
          const diffTime = deadline.getTime() - now.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          matchesClosingSoon = diffDays >= 0 && diffDays <= 14; // within next 14 days
        } else {
          matchesClosingSoon = false;
        }
      }

      return matchesSearch && matchesOrg && matchesDuration && matchesRecentlyOpened && matchesClosingSoon;
    });
  }, [initialPrograms, searchQuery, selectedOrgs, selectedDurations, showRecentlyOpened, showClosingSoon]);
  
  const activeFiltersCount = selectedOrgs.length + selectedDurations.length + (showRecentlyOpened ? 1 : 0) + (showClosingSoon ? 1 : 0);

  const formatDate = (date: string | null) => {
    if (!date) return "TBD";
    const dateStr = new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateStr}, 11:59 PM IST`;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Content Area */}
      <div className="flex-1 space-y-6 w-full min-w-0">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[#1A1A2E] font-medium text-sm">
            {filteredPrograms.length === initialPrograms.length 
              ? `Showing all ${initialPrograms.length} Programs`
              : `Showing ${filteredPrograms.length} of ${initialPrograms.length} Programs`}
          </p>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
              <Input 
                type="text" 
                placeholder="Search programs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-full bg-white border-muted/60 focus:border-[#F26522] text-sm rounded-full"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="h-9 rounded-full px-4 bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90 flex items-center gap-2 shadow-sm border-none">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#F26522] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto p-6">
                <SheetHeader className="mb-6 pb-6 border-b border-muted/60">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-8">
                  {/* Status Filters */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#1A1A2E] border-b border-muted/60 pb-2">Status</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#1A1A2E] cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={showRecentlyOpened}
                          onChange={(e) => setShowRecentlyOpened(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 accent-[#F26522] text-[#F26522] focus:ring-[#F26522] transition-colors cursor-pointer"
                        />
                        <span className="truncate transition-all">Recently Opened</span>
                      </label>
                      <label className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#1A1A2E] cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={showClosingSoon}
                          onChange={(e) => setShowClosingSoon(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 accent-[#F26522] text-[#F26522] focus:ring-[#F26522] transition-colors cursor-pointer"
                        />
                        <span className="truncate transition-all">Closing Soon</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Duration Filters */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#1A1A2E] border-b border-muted/60 pb-2">Program Duration</h3>
                    <div className="space-y-3">
                      {durations.length > 0 ? (
                        durations.map((duration) => (
                          <label
                            key={duration}
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#1A1A2E] cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDurations.includes(duration)}
                              onChange={() => toggleDuration(duration)}
                              className="w-4 h-4 rounded border-gray-300 accent-[#F26522] text-[#F26522] focus:ring-[#F26522] transition-colors cursor-pointer"
                            />
                            <span className="truncate transition-all">{duration}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No durations available</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#1A1A2E] border-b border-muted/60 pb-2">Organizations</h3>
                    <div className="space-y-3">
                      {organizations.map((org) => (
                        <label
                          key={org}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#1A1A2E] cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedOrgs.includes(org)}
                            onChange={() => toggleOrg(org)}
                            className="w-4 h-4 rounded border-gray-300 accent-[#F26522] text-[#F26522] focus:ring-[#F26522] transition-colors cursor-pointer"
                          />
                          <span className="truncate transition-all">{org}</span>
                        </label>
                      ))}
                      {organizations.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">No organizations available</p>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <div 
                key={program.id} 
                className="bg-white border border-muted/40 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col relative"
              >
                {/* Program Status Badge */}
                <Badge className={`absolute top-3 left-3 z-10 text-white border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm ${
                  program.status === 'ACTIVE' ? 'bg-[#1A1A2E]' : 
                  (program.applicationDeadline && new Date(program.applicationDeadline) < new Date()) || program.status !== 'INTAKE' ? 'bg-gray-500' :
                  'bg-[#00B87C]'
                }`}>
                  {program.status === 'ACTIVE' ? 'Closed' : (program.applicationDeadline && new Date(program.applicationDeadline) < new Date()) || program.status !== 'INTAKE' ? 'Completed' : 'Active'}
                </Badge>

                {/* Thumbnail */}
                <div className="w-full aspect-video relative bg-[#F5F5EE]/30 border-b sm:border-b-0 sm:border-r border-muted/20">
                  {program.thumbnail ? (
                    <Image src={program.thumbnail} alt={program.name || "Program"} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E]/5 to-[#2B2B3E]/10 flex items-center justify-center">
                      <span className="text-[#1A1A2E]/20 font-black text-6xl">{(program.name || "C").charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col items-start text-left space-y-4">
                    <h4 className="text-base font-bold text-[#1A1A2E] tracking-tight group-hover:text-[#F26522] transition-colors line-clamp-2">
                      {program.name}
                    </h4>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg border border-muted/40 overflow-hidden relative bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                        {program.startupHub?.image ? (
                          <Image src={program.startupHub.image} alt={program.startupHub.name} fill className="object-cover" />
                        ) : (
                          <Building2 className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-black text-[#1A1A2E]/40 uppercase tracking-tighter mb-0.5">Managed By</p>
                        <p className="text-xs font-bold text-[#1A1A2E] truncate">
                          {program.startupHub?.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-left pt-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Closes on:</p>
                      <p className="text-xs font-medium text-[#1A1A2E]">
                        {formatDate(program.applicationDeadline)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 sm:gap-3">
                    <Link
                      href={`/explore/startup-hubs/${program.startupHubId}/programs/${program.id}`}
                      className="flex-1 py-2 sm:py-2.5 border-2 border-muted/60 text-[10px] sm:text-xs font-bold rounded-lg text-[#1A1A2E] hover:border-[#1A1A2E] transition-all text-center"
                    >
                      View details
                    </Link>
                    
                    {program.status === 'INTAKE' && !(program.applicationDeadline && new Date(program.applicationDeadline) < new Date()) ? (
                      <Link
                        href={program.applyUrl || `/explore/startup-hubs/${program.startupHubId}/programs/${program.id}/apply`}
                        onClick={(e) => requireAuth(e, program.applyUrl ? `/explore/startup-hubs/${program.startupHubId}/programs/${program.id}` : `/explore/startup-hubs/${program.startupHubId}/programs/${program.id}/apply`)}
                        target={program.applyUrl ? "_blank" : undefined}
                        rel={program.applyUrl ? "noopener noreferrer" : undefined}
                        className="flex-1 py-2 sm:py-2.5 bg-[#F26522] text-white text-[10px] sm:text-xs font-bold rounded-lg hover:brightness-110 transition-all text-center shadow-sm"
                      >
                        Apply now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-2 sm:py-2.5 bg-muted text-muted-foreground text-[10px] sm:text-xs font-bold rounded-full cursor-not-allowed text-center"
                      >
                        Closed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/50 rounded-2xl border border-dashed border-[#1A1A2E]/10">
              <Building2 className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-base font-bold text-[#1A1A2E]">No programs found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
