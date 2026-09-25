"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, Building2, PencilLine, Share2, Trash2, MoreVertical } from "lucide-react";
import { getGovDepartmentData, deleteFundingOpportunity } from "@/actions/gov-department";
import { 
  Skeleton, 
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@onlystartups/ui";
import { toast } from "sonner";
import { ShareSchemeDialog } from "@/components/gov-department/share-scheme-dialog";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FundingOpportunity {
  id: string;
  name: string;
  image: string | null;
  keyHighlights: string | null;
  deadline: string | null;
  applyUrl: string | null;
  govDepartment?: { name: string; startupName?: string; image?: string };
  reports?: any[];
}

export default function FundingOpportunitiesPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<{ fundingOpportunities?: FundingOpportunity[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this funding opportunity?")) return;
    try {
      const res = await deleteFundingOpportunity(id);
      if (res && !res.error) {
        toast.success("Funding opportunity deleted successfully");
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            fundingOpportunities: prev.fundingOpportunities?.filter(o => o.id !== id) || []
          };
        });
      } else {
        toast.error(res?.error || "Failed to delete funding opportunity");
      }
    } catch (err) {
      toast.error("Failed to delete funding opportunity");
    }
  };

  const fetchData = useCallback(async () => {
    const res = await getGovDepartmentData();
    if (!("error" in res)) {
      setData(res);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const formatDate = (date: string | null) => {
    if (!date) return "TBD";
    const dateStr = new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateStr}, 11:59 PM IST`;
  };

  if (loading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl p-4 space-y-4 shadow-sm">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#1A1A2E] to-[#2a2a4a] p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Procurement Contracts</h1>
          <p className="text-white/70 max-w-xl text-sm leading-relaxed">
            Manage, track, and deploy procurement contracts and tenders for your startup ecosystem.
          </p>
        </div>
        <div className="shrink-0 relative z-10">
          <Link
            href="/gov-department/funding-opportunities/new"
            className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-[#F26522] text-white font-black uppercase tracking-wider hover:brightness-110 transition-colors shadow-lg"
          >
            Create Contract
          </Link>
        </div>
      </div>

        {(!data?.fundingOpportunities || data.fundingOpportunities.length === 0) ? (
           <div className="py-16 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Sparkles className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-500 font-medium">No procurement contracts created yet.</p>
           </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Contract Name</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Status</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Closing Date</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Applications</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.fundingOpportunities?.map((opportunity: FundingOpportunity) => {
                    const isClosed = opportunity.deadline && new Date(opportunity.deadline) < new Date();
                    const reports = opportunity.reports || [];

                    return (
                      <TableRow key={opportunity.id} className="border-gray-50 hover:bg-gray-50/40 transition-colors">
                        <TableCell className="py-4 px-6 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                          <div className="flex items-center gap-3">
                            {opportunity.image ? (
                              <div className="w-12 h-8 rounded bg-gray-50 overflow-hidden shrink-0 relative border border-gray-100">
                                <Image src={opportunity.image} alt={opportunity.name || "Opportunity"} fill className="object-contain" />
                              </div>
                            ) : (
                              <div className="w-12 h-8 rounded bg-gradient-to-br from-[#1A1A2E]/5 to-[#2B2B3E]/10 flex items-center justify-center shrink-0 border border-gray-100">
                                <span className="text-[#1A1A2E]/30 font-black text-xs">{(opportunity.name || "F").charAt(0)}</span>
                              </div>
                            )}
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-[#1A1A2E] leading-tight break-words line-clamp-2">{opportunity.name}</h4>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-transparent", isClosed ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100')}>
                            {isClosed ? 'Closed' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-xs text-gray-600 font-medium">
                          {formatDate(opportunity.deadline)}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="font-black text-[#F26522] text-sm">{reports.length}</span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1A1A2E]/50 hover:text-[#1A1A2E]">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1">
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <div className="w-full flex items-center gap-2">
                                  <ShareSchemeDialog 
                                    scheme={opportunity} 
                                    govDepartmentId={session?.user?.id || ""} 
                                    trigger={
                                      <button className="w-full flex items-center gap-2 text-left">
                                        <Share2 className="w-4 h-4 text-gray-400" />
                                        <span>Share</span>
                                      </button>
                                    }
                                  />
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/gov-department/funding-opportunities/new?id=${opportunity.id}`} className="w-full flex items-center gap-2">
                                  <PencilLine className="w-4 h-4 text-gray-400" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                                onClick={() => handleDeleteOpportunity(opportunity.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
    </div>
  );
}
