"use client";
import { useCallback } from 'react';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  AlertTriangle,
  Zap,
  PlusCircle,
  TrendingUp,
  Clock,
  BadgeAlert,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@onlystartups/ui";
import { CreateIssueDialog } from "./create-issue-dialog";
import { toggleUpvoteAction } from "@/actions/fix-this";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@onlystartups/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@onlystartups/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@onlystartups/ui";

interface Issue {
  id: string;
  title: string;
  coreFriction: string;
  targetDemographic: string;
  manualWorkarounds: string;
  tags: string[];
  createdAt: string;
  painIndex: number;
  upvotesCount: number;
  commentsCount: number;
  hasUpvoted: boolean;
  user: {
    name: string | null;
    image: string | null;
    role?: string | null;
  };
}

interface FeedContentProps {
  initialIssues: Issue[];
}

export function FeedContent({ initialIssues }: FeedContentProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular");
  const [openCreate, setOpenCreate] = useState(false);
  const [openAuthAlert, setOpenAuthAlert] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const itemsPerPage = 10;

  const toggleExpand = (id: string) => {
    setExpandedIssues((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Extract all unique tags and sort alphabetically (excluding "All")
  const uniqueTags = Array.from(new Set(initialIssues.flatMap((i) => i.tags || []))).filter(Boolean);
  uniqueTags.sort((a, b) => a.localeCompare(b));
  const allTags = ["All", ...uniqueTags];

  const visibleCount = 7;
  const visibleTags = allTags.slice(0, visibleCount);
  const dropdownTags = allTags.slice(visibleCount);
  const isDropdownActive = dropdownTags.includes(tagFilter);
  const dropdownLabel = isDropdownActive ? tagFilter : "More";

  // Fetch filtered and sorted data from backend
  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (tagFilter !== "All") queryParams.append("tag", tagFilter);
      if (search) queryParams.append("search", search);
      queryParams.append("sort", sortBy);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = session;

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/fix-this?${queryParams.toString()}`, {
        headers,
        next: { revalidate: 0 },
      });

      if (!res.ok) throw new Error("Failed to fetch feed");
      const data = await res.json();
      setIssues(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [session, search, sortBy, tagFilter]);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    fetchIssues();
    setCurrentPage(1);
  }, [tagFilter, sortBy, search, session, fetchIssues, hasMounted]);

  const handleUpvote = async (issueId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setOpenAuthAlert(true);
      return;
    }

    try {
      // Optimistic UI update
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id === issueId) {
            const hasUpvoted = !issue.hasUpvoted;
            const diff = hasUpvoted ? 1 : -1;
            return {
              ...issue,
              hasUpvoted,
              upvotesCount: issue.upvotesCount + diff,
              painIndex: issue.painIndex + (diff * 15),
            };
          }
          return issue;
        })
      );

      const result = await toggleUpvoteAction(issueId);

      if (result.upvoted) {
        toast.success("Upvoted!");
      } else {
        toast.info("Upvote removed.");
      }

      fetchIssues(); // Sync up from backend
    } catch (err: any) {
      toast.error(err.message || "Failed to upvote");
      fetchIssues(); // Rollback on error
    }
  };

  const handlePostClick = () => {
    if (!isLoggedIn) {
      setOpenAuthAlert(true);
    } else {
      setOpenCreate(true);
    }
  };

  // Helper to color Pain Index badge
  const getPainColor = (index: number) => {
    if (index >= 30) return "bg-[#F26522]/20 text-[#F26522] border-[#F26522]/30";
    if (index >= 15) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  const totalPages = Math.ceil(issues.length / itemsPerPage);
  const paginatedIssues = issues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("ellipsis-1");
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push("ellipsis-2");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A2E]/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#1A1A2E] tracking-tight">
            Fix<span className="font-serif font-normal italic text-[#F26522]">This</span>
          </h1>
          <p className="text-sm text-[#1A1A2E]/60 max-w-xl">
            A public board to share real operational problems, workflow bottlenecks, and daily frustrations. No product pitches just the problems.
          </p>
        </div>
        <Button
          onClick={handlePostClick}
          className="bg-[#F26522] hover:bg-[#D7541A] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-[#F26522]/20 self-start md:self-center flex items-center gap-1.5 px-4 py-2.5"
        >
          <PlusCircle className="w-4 h-4" />
          Share a Problem
        </Button>
      </div>

      {/* Filter and Sorting Panel */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#1A1A2E]/40" />
            <Input
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-transparent border-[#1A1A2E]/10 focus:border-[#F26522] rounded-xl text-sm w-full"
            />
          </div>

          {/* Sorting Toggle */}
          <div className="w-full sm:w-44 shrink-0 flex items-center justify-end border border-[#1A1A2E]/10 bg-[#1A1A2E]/5 p-0.5 rounded-xl">
            <button
              onClick={() => setSortBy("popular")}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === "popular"
                  ? "bg-[#1A1A2E] text-white"
                  : "text-[#1A1A2E]/60 hover:text-[#1A1A2E]"
                }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Hot
            </button>
            <button
              onClick={() => setSortBy("newest")}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === "newest"
                  ? "bg-[#1A1A2E] text-white"
                  : "text-[#1A1A2E]/60 hover:text-[#1A1A2E]"
                }`}
            >
              <Clock className="w-3.5 h-3.5" />
              New
            </button>
          </div>
        </div>

        {/* Category Filter Section */}
        <div className="space-y-2 pt-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A2E]/40">Category</h3>
          <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap py-1 max-w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleTags.map((tag) => {
              const isActive = tagFilter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer select-none shrink-0 ${isActive
                      ? "bg-[#1A1A2E] text-white border-transparent shadow-sm"
                      : "bg-[#1A1A2E]/5 text-[#1A1A2E]/60 border-transparent hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/10"
                    }`}
                >
                  {tag === "All" ? "All Categories" : tag}
                </button>
              );
            })}

            {dropdownTags.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer select-none shrink-0 flex items-center gap-1 outline-none ${isDropdownActive
                        ? "bg-[#1A1A2E] text-white border-transparent shadow-sm"
                        : "bg-[#1A1A2E]/5 text-[#1A1A2E]/60 border-transparent hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/10"
                      }`}
                  >
                    <span>{dropdownLabel}</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#F5F5EE] border-[#1A1A2E]/10 max-h-60 overflow-y-auto">
                  {dropdownTags.map((tag) => (
                    <DropdownMenuItem
                      key={tag}
                      onClick={() => setTagFilter(tag)}
                      className={`text-xs font-bold px-3 py-2 cursor-pointer transition-colors ${tagFilter === tag
                          ? "bg-[#1A1A2E] text-white focus:bg-[#1A1A2E] focus:text-white"
                          : "text-[#1A1A2E]/70 hover:bg-[#1A1A2E]/5 focus:bg-[#1A1A2E]/5 focus:text-[#1A1A2E]"
                        }`}
                    >
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-0 relative min-h-[400px]">
        {isLoading ? (
          <div className="space-y-0">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col sm:flex-row sm:items-center justify-between px-0 py-3.5 border-b border-[#1A1A2E]/5 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="hidden sm:block w-14 h-7 bg-[#1A1A2E]/10 rounded-full shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full max-w-lg">
                    <div className="h-5 w-full bg-[#1A1A2E]/10 rounded-md" />
                    <div className="flex gap-1 shrink-0">
                      <div className="w-16 h-4 bg-[#1A1A2E]/10 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end shrink-0">
                  <div className="w-12 h-6 bg-[#1A1A2E]/10 rounded-full" />
                  <div className="w-16 h-6 bg-[#1A1A2E]/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-[#1A1A2E]/20" />
            <p className="text-[#1A1A2E]/60 text-sm">No issues found matching your criteria.</p>
          </div>
        ) : (
          paginatedIssues.map((issue) => {
            const isExpanded = !!expandedIssues[issue.id];
            return (
              <Link key={issue.id} href={`/fix-this/${issue.id}`}>
                <Card className="p-0 gap-0 bg-transparent shadow-none hover:shadow-none border-t-0 border-x-0 border-b border-[#1A1A2E]/5 hover:border-b-[#F26522]/30 transition-all rounded-none group overflow-hidden cursor-pointer last:border-b-0">
                  {/* Single Line Header/Content Wrapper when collapsed */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-0 py-2.5">
                    {/* Left part: Vote Pill + Title + Tags */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Vote Pill - hidden on mobile, shown on sm+ */}
                      <div className="hidden sm:flex items-center bg-[#1A1A2E]/5 hover:bg-[#1A1A2E]/8 transition-colors rounded-full p-0.5 border border-[#1A1A2E]/5 shrink-0">
                        <button
                          onClick={(e) => handleUpvote(issue.id, e)}
                          className={`p-1 rounded-full transition-colors cursor-pointer ${issue.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/50 hover:text-[#F26522]"
                            }`}
                          title={issue.hasUpvoted ? "Remove Upvote" : "Upvote"}
                        >
                          <ArrowUp className={`w-3.5 h-3.5 ${issue.hasUpvoted ? "fill-current" : ""}`} />
                        </button>
                        <span className={`px-1.5 font-bold text-xs font-mono select-none ${issue.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/80"}`}>
                          {issue.upvotesCount}
                        </span>
                        <button
                          onClick={(e) => handleUpvote(issue.id, e)}
                          className="p-1 rounded-full text-[#1A1A2E]/30 hover:text-[#F26522] transition-colors cursor-pointer"
                          title="Downvote"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title & Tags */}
                      <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <CardTitle className="text-sm sm:text-base font-bold font-sans text-[#1A1A2E] leading-snug group-hover:text-[#F26522] transition-colors">
                          {issue.title}
                        </CardTitle>
                        {issue.tags && issue.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 shrink-0">
                            {issue.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-bold text-[#F26522] bg-[#F26522]/5 border border-[#F26522]/10 rounded-md px-1.5 py-0.5"
                              >
                                Category: {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right part: Vote (mobile), Comments count, Pain Index, Share, Chevron */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 justify-end flex-wrap">
                      {/* Vote Pill - mobile only */}
                      <div className="flex sm:hidden items-center bg-[#1A1A2E]/5 hover:bg-[#1A1A2E]/8 transition-colors rounded-full p-0.5 border border-[#1A1A2E]/5 shrink-0">
                        <button
                          onClick={(e) => handleUpvote(issue.id, e)}
                          className={`p-1 rounded-full transition-colors cursor-pointer ${issue.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/50 hover:text-[#F26522]"
                            }`}
                          title={issue.hasUpvoted ? "Remove Upvote" : "Upvote"}
                        >
                          <ArrowUp className={`w-3.5 h-3.5 ${issue.hasUpvoted ? "fill-current" : ""}`} />
                        </button>
                        <span className={`px-1.5 font-bold text-xs font-mono select-none ${issue.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/80"}`}>
                          {issue.upvotesCount}
                        </span>
                        <button
                          onClick={(e) => handleUpvote(issue.id, e)}
                          className="p-1 rounded-full text-[#1A1A2E]/30 hover:text-[#F26522] transition-colors cursor-pointer"
                          title="Downvote"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Comments count pill */}
                      <div className="flex items-center gap-1 bg-[#1A1A2E]/5 rounded-full px-2.5 py-1 text-[#1A1A2E]/70 font-bold text-[11px] border border-[#1A1A2E]/5 select-none">
                        <MessageSquare className="w-3 h-3 text-[#1A1A2E]/50" />
                        <span>{issue.commentsCount}</span>
                      </div>

                      {/* Pain index pill */}
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-bold text-[11px] border select-none ${getPainColor(issue.painIndex)}`} title="Validation Pain Index">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>{issue.painIndex.toFixed(0)} Pain</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const origin = typeof window !== "undefined" ? window.location.origin : "";
                          navigator.clipboard.writeText(`${origin}/fix-this/${issue.id}`);
                          toast.success("Link copied to clipboard!");
                        }}
                        className="hidden sm:flex items-center gap-1 bg-[#1A1A2E]/5 hover:bg-[#1A1A2E]/10 transition-colors rounded-full px-2.5 py-1 text-[#1A1A2E]/70 font-bold text-[11px] border border-[#1A1A2E]/5 cursor-pointer"
                      >
                        <span className="text-[#1A1A2E]/50 text-[10px]">🔗</span>
                        <span>Share</span>
                      </button>

                      {/* Chevron expand */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleExpand(issue.id);
                        }}
                        className="p-1 hover:bg-[#1A1A2E]/5 rounded-full text-[#1A1A2E]/40 hover:text-[#1A1A2E]/80 transition-all cursor-pointer"
                        title={isExpanded ? "Hide Details" : "Show Details"}
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content Dropdown */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="px-4 pb-4 pt-0 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#1A1A2E]/5 pt-4">
                            <div>
                              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">
                                The Problem
                              </h4>
                              <p className="text-sm font-medium text-[#1A1A2E]/80 line-clamp-3 leading-relaxed">
                                {issue.coreFriction}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">
                                Who Faces This
                              </h4>
                              <p className="text-sm font-medium text-[#1A1A2E]/70 line-clamp-3 leading-relaxed">
                                {issue.targetDemographic}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">
                                Current Workaround
                              </h4>
                              <p className="text-sm font-medium text-[#1A1A2E]/70 line-clamp-3 leading-relaxed italic text-amber-800">
                                {issue.manualWorkarounds}
                              </p>
                            </div>
                          </div>

                          {/* Logged by user section inside dropdown */}
                          <div className="pt-3 border-t border-[#1A1A2E]/5 flex items-center justify-between text-xs text-[#1A1A2E]/40">
                            <div className="flex items-center gap-1.5">
                              <span>Logged by</span>
                              <span className="font-bold text-[#1A1A2E]/60">{`${(issue.user as any).firstName || ''} ${(issue.user as any).lastName || ''}`.trim() || "Anonymous"}</span>
                              {issue.user.role && (
                                <span className="uppercase tracking-wider font-extrabold text-[9px] text-[#1A1A2E]/40 bg-zinc-100 px-1 py-0.5 rounded-md">
                                  {issue.user.role}
                                </span>
                              )}
                            </div>
                            <span>
                              {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </Link>
            );
          })
        )}
        </div>

        {totalPages > 1 && (
          <div className="pt-8 pb-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-40 cursor-not-allowed select-none text-[#1A1A2E]/50" : "cursor-pointer text-[#1A1A2E] hover:text-[#F26522] transition-colors"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, idx) => {
                    if (typeof page === "string" && page.startsWith("ellipsis")) {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis className="text-[#1A1A2E]/40" />
                        </PaginationItem>
                      );
                    }

                    const pageNum = page as number;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          className={`cursor-pointer transition-all w-9 h-9 flex items-center justify-center rounded-md ${pageNum === currentPage
                              ? "bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90"
                              : "text-[#1A1A2E]/70 hover:text-[#F26522] hover:bg-[#F26522]/5"
                            }`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-40 cursor-not-allowed select-none text-[#1A1A2E]/50" : "cursor-pointer text-[#1A1A2E] hover:text-[#F26522] transition-colors"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}


      {/* Log Bottleneck Dialog */}
      <CreateIssueDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={() => {
          fetchIssues();
        }}
      />

      {/* Authentication Dialog */}
      <Dialog open={openAuthAlert} onOpenChange={setOpenAuthAlert}>
        <DialogContent className="max-w-md bg-[#F5F5EE] border-[#1A1A2E]/10 p-6 rounded-2xl shadow-xl">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-xl font-bold font-sans text-[#1A1A2E]">
              Authentication <span className="font-serif font-normal italic text-[#F26522]">Required</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-[#1A1A2E]/60">
              Anyone can view problems, but you must be logged in to OnlyStartups to log new problems, upvote problems, or post comments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenAuthAlert(false)}
              className="border-[#1A1A2E]/10 text-[#1A1A2E]/60 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              onClick={() => router.push("/auth/login?callbackUrl=/fix-this")}
              className="bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"
            >
              Login / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
