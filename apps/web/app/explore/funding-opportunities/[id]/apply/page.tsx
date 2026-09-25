"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import { applyToGrant } from "@/actions/explore/apply";
import { getGrantById } from "@/actions/explore";
import { trackAnalytics } from "@/actions/dashboard/analytics";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function GrantApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [grantName, setGrantName] = useState("");
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const fetchGrant = async () => {
      try {
        const res = await getGrantById(params.id as string);
        if ("error" in res) {
          toast.error("Pilot & Tender not found.");
          router.push("/explore");
        } else if (res.applyUrl) {
          window.location.replace(res.applyUrl);
        } else {
          setGrantName(res.name);
        }
      } catch (err) {
        console.error("Error loading grant:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id && session?.user) {
      void fetchGrant();
      void trackAnalytics("FORM_VIEW", "funding_opportunity", params.id as string);
    }
  }, [params.id, session, router]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Proposal message is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await applyToGrant({
        opportunityId: params.id as string,
        message,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        setSubmitted(true);
        toast.success("Grant application submitted successfully!");
        void trackAnalytics("FORM_SUBMIT", "funding_opportunity", params.id as string);
        setTimeout(() => {
          router.push(`/explore/funding-opportunities/${params.id}`);
        }, 2500);
      }
    } catch (err) {
      toast.error("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Loading grant form...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight">Application Submitted!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-normal">
            Your proposal for <strong>{grantName}</strong> has been saved. Redirecting you back to the grant page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 min-h-[80dvh] flex flex-col justify-between w-full">
      {/* Top Progress Navigator */}
      <div className="space-y-3">
        <Link
          href={`/explore/funding-opportunities/${params.id}`}
          className="text-[10px] sm:text-xs font-black text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors tracking-widest uppercase w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel Application
        </Link>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <span className="truncate max-w-[200px]">{grantName} Grant Application</span>
            <span>Question 1 of 1</span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Slide Content Area */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center py-6 sm:py-10 space-y-5">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1A2E] tracking-tight leading-snug">
            Proposal / Personal Message
            <span className="text-red-500 ml-1">*</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Describe your project and how you intend to use the grant funds. Include budget allocation plans and program alignment details.
          </p>
        </div>

        <div className="pt-1">
          <textarea
            ref={inputRef}
            required
            placeholder="Type your grant proposal here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-36 sm:h-48 border border-muted-foreground/30 focus:border-primary/50 outline-none rounded-xl p-4 text-sm sm:text-base resize-none bg-white shadow-sm transition-colors"
          />
        </div>

        {/* Action Button at bottom */}
        <div className="border-t border-muted/60 pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-[#1A1A2E] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:bg-black transition-all shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Grant Application
                <CheckCircle className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
