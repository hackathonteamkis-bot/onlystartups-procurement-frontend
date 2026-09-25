"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Search, ArrowLeft, MapPin, Users, ArrowRight } from "lucide-react";
import { getEvents, registerForEvent } from "@/actions/events";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@onlystartups/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Badge } from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Button } from "@onlystartups/ui";
import { Card, CardContent } from "@onlystartups/ui";

interface Meetup {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  isApplied?: boolean;
  govDepartment: {
    name: string;
    startupName?: string;
    image?: string;
  };
}

export default function ExploreMeetupsPage() {
  const router = useRouter();
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMeetups = async () => {
    try {
      const res = await getEvents();
      setMeetups(res);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, []);

  const filteredMeetups = meetups.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      (m.govDepartment?.startupName || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-muted/40 rounded-xl p-6 flex flex-col h-[320px]"
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-muted/40">
                <Skeleton className="flex-1 h-11 rounded-xl" />
                <Skeleton className="flex-1 h-11 rounded-xl" />
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
          title="Briefings & Workshops"
          description="Connect with government departments through sessions and briefings."
        >
          <div className="relative w-full sm:w-[320px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
            <Input
              placeholder="Search by event title, location, or host..."
              className="pl-10 h-10 bg-white border-muted/30 rounded-full shadow-sm focus:ring-primary/20 transition-all font-medium w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </PageHeader>
      </div>

      <AnimatePresence mode="wait">
        {filteredMeetups.length > 0 ? (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
          >
            {filteredMeetups.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                onUpdate={fetchMeetups}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-muted/5 rounded-xl border-2 border-dashed border-muted/20"
          >
            <div className="h-20 w-20 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Calendar className="w-10 h-10 text-muted-foreground/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#1A1A2E]">
                No Events Found
              </h3>
              <p className="text-muted-foreground max-w-sm text-sm font-medium">
                Try adjusting your search criteria or explore other categories.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MeetupCard({
  meetup,
  onUpdate,
}: {
  meetup: Meetup;
  onUpdate: () => void;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const requireAuth = (e: React.MouseEvent, customMessage?: string) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.info(customMessage || "Please login to register or view details.");
      // We don't have router directly in MeetupCard, so we use window.location or we pass it
      window.location.href = "/";
      return false;
    }
    return true;
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsApplying(true);
    try {
      const res = await registerForEvent(meetup.id);
      if (res.success) {
        toast.success(res.success);
        onUpdate();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-muted/60 rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col h-full cursor-pointer"
      onClick={(e) => {
        if (requireAuth(e, "Please login to view details.")) {
          router.push(`/explore/events/${meetup.id}`);
        }
      }}
    >
      {/* Event Cover Image Banner */}
      {meetup.image ? (
        <div className="h-32 w-full bg-gray-100 relative shrink-0">
          <Image src={meetup.image} alt={meetup.title} fill unoptimized className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-32 w-full bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center shrink-0 border-b border-gray-100">
          <Calendar className="w-8 h-8 text-gray-300" />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col space-y-3">
        {/* Title and Host */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#1A1A2E] leading-tight line-clamp-2 break-words">
            {meetup.title}
          </h3>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            By {meetup.govDepartment?.startupName || meetup.govDepartment?.name}
          </p>
        </div>

        {/* Date / Time */}
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mt-auto pt-3 border-t border-muted/20">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
            {new Date(meetup.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" /> {meetup.time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
