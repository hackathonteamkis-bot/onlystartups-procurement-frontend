"use client";


import { useEffect, useState, useMemo } from "react";
import {
  Building2,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import { getExploreData } from "@/actions/explore";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface StartupHub {
  id: string;
  name: string;
  startupName?: string;
  startupDescription?: string;
  image?: string;
  category?: string;
  isApplied?: boolean;
  applicationFormActive?: boolean;
}

export default function StartupHubsPage() {
  const [data, setData] = useState<StartupHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const industries = [
    "All",
    "Fintech",
    "AI",
    "SaaS",
    "Healthtech",
    "E-commerce",
    "Web3",
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getExploreData();
        setData((res as { startupHubs?: StartupHub[] }).startupHubs || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      const s = search.toLowerCase();
      const matchesSearch =
        !search ||
        (item.name || item.startupName || "").toLowerCase().includes(s) ||
        (item.startupDescription || "").toLowerCase().includes(s);

      const matchesIndustry =
        selectedIndustry === "All" ||
        (item.category || "").toLowerCase() ===
        selectedIndustry.toLowerCase() ||
        (item.startupDescription || "")
          .toLowerCase()
          .includes(selectedIndustry.toLowerCase());

      return matchesSearch && matchesIndustry;
    });
    return filtered;
  }, [data, search, selectedIndustry]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedIndustry]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
          <div className="flex items-center gap-2 pt-4">
            <Skeleton className="h-10 w-full md:w-[320px] rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-muted/60 rounded-xl p-4 flex flex-col h-[140px] gap-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          title="Startup Hub Directory"
          description="Find top startup hubs and accelerators to build your startup."
        >
          <div className="flex items-center gap-2">
            <div className="relative group w-full md:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                placeholder="Search startup hubs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-white border-muted/30 rounded-lg shadow-sm focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="h-10 px-4 rounded-full border border-muted bg-white hover:bg-muted/50 transition-colors flex items-center gap-2 text-sm font-medium">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Startup Hubs</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Industry Focus
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => setSelectedIndustry(ind)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            selectedIndustry === ind
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {paginatedData.map((item: StartupHub) => (
            <CardMinimal key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-9 px-3 rounded-lg border border-muted bg-white text-sm font-medium hover:bg-muted/50 disabled:opacity-50 transition-all"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "h-9 w-9 rounded-lg text-sm font-bold transition-all",
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "bg-white border border-muted hover:bg-muted/50 text-muted-foreground",
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="h-9 px-3 rounded-lg border border-muted bg-white text-sm font-medium hover:bg-muted/50 disabled:opacity-50 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10 rounded-2xl border-2 border-dashed border-muted">
          <Building2 className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            No startup hubs found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

function CardMinimal({ item }: { item: StartupHub }) {
  const { status } = useSession();
  const router = useRouter();

  const requireAuth = (e: React.MouseEvent, customMessage?: string) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.info(customMessage || "Please login to apply or view details.");
      router.push("/auth/login");
      return false;
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -2 }}
      className="group relative bg-white border border-muted/60 rounded-xl p-4 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col h-full"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 rounded-lg border border-muted-foreground/5 bg-muted/10">
          {item.image && <AvatarImage src={item.image} className="object-cover" />}
          <AvatarFallback className="text-[10px] font-bold bg-[#1A1A2E] text-white">
            {(item.startupName || item.name || "?").charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#1A1A2E] truncate group-hover:text-primary transition-colors leading-none">
            {item.startupName || item.name}
          </h3>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-hidden">
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {item.startupDescription ||
            "Empowering founders with strategic growth support."}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">

        <Link
          href={`/explore/startup-hubs/${item.id}`}
          onClick={(e) => requireAuth(e, "Please login to view details.")}
          className="flex-1 h-8 bg-muted/50 text-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-all flex items-center justify-center font-bold"
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
}
