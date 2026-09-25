"use client";


import { useEffect, useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  ArrowLeft,
  ArrowUpRight,
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
import { Badge } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { hardcodedResources } from "@/lib/data/resources";

interface Resource {
  id: string;
  title: string;
  type: string;
  description?: string;
  url?: string;
}

export default function ResourcesPage() {
  const [data] = useState<Resource[]>(hardcodedResources);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");

  const types = ["All", "Template", "Guide", "Report", "Tool", "Pitch Deck"];

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const s = search.toLowerCase();
      const matchesSearch =
        !search ||
        (item.title || "").toLowerCase().includes(s) ||
        (item.type || "").toLowerCase().includes(s);

      const matchesType =
        activeType === "All" ||
        (item.type || "").toLowerCase() === activeType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [data, search, activeType]);

  // Removed loading state logic since data is static

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/explore"
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline w-fit"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Explore
        </Link>
        <PageHeader
          title="Founder Resources"
          description="Strategic assets to accelerate your startup journey."
        >
          <div className="flex items-center gap-2">
            <div className="relative group w-full md:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-white border-muted rounded-lg focus-visible:ring-1"
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
                  <DialogTitle>Filter Resources</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Resource Type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {types.map((t) => (
                        <button
                          key={t}
                          onClick={() => setActiveType(t)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            activeType === t
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {t}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item: Resource) => (
            <CardMinimal key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10 rounded-xl border-2 border-dashed border-muted">
          <FileText className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            No resources found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

function CardMinimal({ item }: { item: Resource }) {
  const { status } = useSession();
  const router = useRouter();

  const requireAuth = (e: React.MouseEvent, customMessage?: string) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.info(customMessage || "Please login to access this file.");
      router.push("/");
      return false;
    }
    return true;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-muted/60 rounded-2xl p-4 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col h-full"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#1A1A2E] truncate group-hover:text-primary transition-colors leading-none">
            {item.title}
          </h3>
          <Badge
            variant="secondary"
            className="mt-1 h-4 px-1 text-[8px] font-black uppercase rounded-sm border-none bg-muted/50 text-muted-foreground"
          >
            {item.type}
          </Badge>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-hidden">
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {item.description ||
            "Strategic ecosystem asset designed for founder growth."}
        </p>
      </div>

      <div className="mt-4">
        <Link 
          href={`/explore/resources/${item.id}`}
          className="w-full h-8 flex items-center justify-center gap-2 bg-muted/30 text-muted-foreground hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all group/btn"
        >
          View
          <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
