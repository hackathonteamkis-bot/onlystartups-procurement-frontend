"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition, useEffect, useMemo, useRef } from "react";
import { Instagram, Linkedin, Rocket, Globe } from "lucide-react";
import { Button } from "@onlystartups/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Separator } from "@onlystartups/ui";
import { setting } from "@/actions/user/settings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@onlystartups/ui";
import { ProfileHeader } from "@/components/profile/profile-header";

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const getPlatformIcon = (platform: string) => {
  const normalized = platform.toLowerCase();
  switch (normalized) {
    case "x":
    case "twitter":
      return <XLogo className="w-4 h-4 fill-current" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "youtube":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-5.32 3.47h-3.008v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "discord":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
        </svg>
      );
    default:
      return <Globe className="w-4 h-4" />;
  }
};

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 sm:pb-10 pt-4 sm:pt-8 w-full animate-in fade-in duration-500">
      <div className="relative pt-4 sm:pt-0">
        <Skeleton className="h-32 sm:h-48 lg:h-56 w-full rounded-xl sm:rounded-2xl" />
        <div className="flex flex-col sm:flex-row items-center sm:items-end px-4 sm:px-10 -mt-12 sm:-mt-16 sm:space-x-6 relative z-10 w-full">
          <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full border-4 border-[#F5F5EE] shrink-0 bg-white" />
          <div className="mt-4 sm:mt-0 pb-2 flex-1 w-full space-y-3 flex flex-col items-center sm:items-start">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
            <div className="flex items-center gap-3 w-full justify-center sm:justify-start">
              <Skeleton className="h-4 sm:h-5 w-32 sm:w-48" />
              <Skeleton className="h-5 w-16 rounded-full hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 sm:space-y-8 w-full pt-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 space-y-6 shadow-sm border border-[#1A1A2E]/5">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-12 sm:h-14 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-12 sm:h-14 w-full rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-32 sm:h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StartupProfilePage() {
  const { data: session, update, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const hasInitialized = useRef(false);

  // Form states
  const [startupName, setStartupName] = useState("");
  const [startupDescription, setStartupDescription] = useState("");
  const [startupPhase, setStartupPhase] = useState("");
  const [activeStartups, setActiveStartups] = useState("");
  const [totalExits, setTotalExits] = useState("");
  const [fundingRaised, setFundingRaised] = useState("");
  const [mentorCount, setMentorCount] = useState("");
  const [networkSize, setNetworkSize] = useState("");
  const [startupHubQuote, setStartupHubQuote] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [location, setLocation] = useState("");
  const [sectors, setSectors] = useState<string[]>([]);
  const [programDuration, setProgramDuration] = useState("");
  const [equityTaken, setEquityTaken] = useState("");
  const [startupHubSocials, setStartupHubSocials] = useState<Record<string, string>>({});

  const initialValues = useMemo(() => {
    if (!session?.user) return {} as Record<string, any>;
    return {
      startupName: session.user.startupName || "",
      startupDescription: session.user.startupDescription || "",
      startupPhase: session.user.startupPhase || "",
      activeStartups: session.user.activeStartups || "",
      totalExits: session.user.totalExits || "",
      fundingRaised: session.user.fundingRaised || "",
      mentorCount: session.user.mentorCount || "",
      networkSize: session.user.networkSize || "",
      startupHubQuote: session.user.startupHubQuote || "",
      websiteUrl: session.user.websiteUrl || "",
      location: session.user.location || "",
      sectors: session.user.sectors || [],
      programDuration: session.user.programDuration || "",
      equityTaken: session.user.equityTaken || "",
      startupHubSocials: session.user.startupHubSocials || {},
    };
  }, [session]);

  const hasChanges = useMemo(() => {
    return (
      startupName !== initialValues.startupName ||
      startupDescription !== initialValues.startupDescription ||
      startupPhase !== initialValues.startupPhase ||
      activeStartups !== initialValues.activeStartups ||
      totalExits !== initialValues.totalExits ||
      fundingRaised !== initialValues.fundingRaised ||
      mentorCount !== initialValues.mentorCount ||
      networkSize !== initialValues.networkSize ||
      startupHubQuote !== initialValues.startupHubQuote ||
      websiteUrl !== initialValues.websiteUrl ||
      location !== initialValues.location ||
      JSON.stringify(sectors) !== JSON.stringify(initialValues.sectors) ||
      programDuration !== initialValues.programDuration ||
      equityTaken !== initialValues.equityTaken ||
      JSON.stringify(startupHubSocials) !== JSON.stringify(initialValues.startupHubSocials)
    );
  }, [
    startupName, startupDescription, startupPhase, activeStartups,
    totalExits, fundingRaised, mentorCount, networkSize,
    startupHubQuote, websiteUrl, location, sectors,
    programDuration, equityTaken, startupHubSocials, initialValues
  ]);

  useEffect(() => {
    if (session?.user && !hasInitialized.current) {
      hasInitialized.current = true;
      const user = session.user;
      setStartupName(user.startupName || "");
      setStartupDescription(user.startupDescription || "");
      setStartupPhase(user.startupPhase || "");
      setActiveStartups(user.activeStartups || "");
      setTotalExits(user.totalExits || "");
      setFundingRaised(user.fundingRaised || "");
      setMentorCount(user.mentorCount || "");
      setNetworkSize(user.networkSize || "");
      setStartupHubQuote(user.startupHubQuote || "");
      setWebsiteUrl(user.websiteUrl || "");
      setLocation(user.location || "");
      setSectors(user.sectors || []);
      setProgramDuration(user.programDuration || "");
      setEquityTaken(user.equityTaken || "");
      setStartupHubSocials(user.startupHubSocials || {});
    }
  }, [session]);

  const onSave = (additionalValues = {}) => {
    const savedData = {
      startupName,
      startupDescription,
      startupPhase,
      activeStartups,
      totalExits,
      fundingRaised,
      mentorCount,
      networkSize,
      startupHubQuote,
      websiteUrl,
      location,
      sectors,
      programDuration,
      equityTaken,
      startupHubSocials,
      ...additionalValues,
    };

    startTransition(() => {
      setting(savedData)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            update({ user: data.user || savedData });
            toast.success("Profile Updated!", {
              description: "Your changes have been saved successfully.",
            });
          }
        })
        .catch((e) => {
          console.error(e);
          toast.error("Something went wrong!");
        });
    });
  };

  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 sm:pb-10">
      
      <ProfileHeader />

      <div className="space-y-6 sm:space-y-8">
        <Card className="border-[#1A1A2E]/5 bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden">
          <CardHeader className="px-5 sm:px-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-black tracking-tighter text-[#1A1A2E]">
                  {session?.user?.role === "STARTUP_HUB"
                    ? "StartupHub Profile"
                    : "Venture Profile"}
                </CardTitle>
                <CardDescription className="font-medium text-[#1A1A2E]/50">
                  {session?.user?.role === "STARTUP_HUB"
                    ? "Define your startupHub's mission and portfolio focus."
                    : "Define your startup thesis and trajectory."}
                </CardDescription>
              </div>
              <Rocket className="w-8 h-8 text-[#1A1A2E] opacity-5 hidden sm:block" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-5 sm:px-8 pb-8 pt-2">
            {session?.user?.role === "STARTUP_HUB" ? (
              <div className="space-y-2">
                <Label
                  htmlFor="startupName"
                  className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                >
                  StartupHub Name
                </Label>
                <Input
                  id="startupName"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  placeholder="StartupHub Entity Name"
                  className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                  disabled={isPending}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="startupName"
                    className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                  >
                    Venture Name
                  </Label>
                  <Input
                    id="startupName"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Visionary Startup Co."
                    className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="startupPhase"
                    className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                  >
                    Growth Phase
                  </Label>
                  <div className="relative">
                    <select
                      id="startupPhase"
                      value={startupPhase}
                      onChange={(e) => setStartupPhase(e.target.value)}
                      className="w-full h-12 sm:h-14 rounded-full border-none bg-[#F5F5EE]/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#F26522]/10 appearance-none shadow-sm"
                      disabled={isPending}
                    >
                      <option value="">Select current stage</option>
                      <option value="Ideation">
                        Ideation / Pre-Seed
                      </option>
                      <option value="MVP">MVP / Building</option>
                      <option value="Early Traction">
                        Early Traction / Seed
                      </option>
                      <option value="Growth">Growth / Scaling</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1A1A2E]/20">
                      <Rocket className="w-4 h-4 mr-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="startupDescription"
                className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
              >
                {session?.user?.role === "STARTUP_HUB"
                  ? "StartupHub Vision / Mission"
                  : "Executive Summary / Venture Thesis"}
              </Label>
              <textarea
                id="startupDescription"
                rows={6}
                value={startupDescription}
                onChange={(e) => setStartupDescription(e.target.value)}
                className="w-full min-h-[160px] rounded-2xl border-none bg-[#F5F5EE]/50 px-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#F26522]/10 transition-all shadow-inner"
                placeholder={
                  session?.user?.role === "STARTUP_HUB"
                    ? "Define your startupHub's mission, the value you provide to startups, and your selection philosophy..."
                    : "Tell us about the problem you are solving, the market size, and your unique approach... This helps other founders understand how to collaborate with you."
                }
                disabled={isPending}
              />
            </div>

            {/* StartupHub-only: Public Profile Fields */}
            {session?.user?.role === "STARTUP_HUB" && (
              <>
                <Separator className="my-2 bg-[#1A1A2E]/5" />
                <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest pt-2">
                  Public Profile Stats
                </h3>
                <p className="text-xs text-muted-foreground -mt-4">
                  These will be displayed on your public startupHub page.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="activeStartups"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Active Startups
                    </Label>
                    <Input
                      id="activeStartups"
                      value={activeStartups}
                      onChange={(e) => setActiveStartups(e.target.value)}
                      placeholder="e.g. 24"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="totalExits"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Total Exits
                    </Label>
                    <Input
                      id="totalExits"
                      value={totalExits}
                      onChange={(e) => setTotalExits(e.target.value)}
                      placeholder="e.g. 8"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="fundingRaised"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Funding Raised
                    </Label>
                    <Input
                      id="fundingRaised"
                      value={fundingRaised}
                      onChange={(e) => setFundingRaised(e.target.value)}
                      placeholder="e.g. ₹4.2M"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="mentorCount"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Mentor Count
                    </Label>
                    <Input
                      id="mentorCount"
                      value={mentorCount}
                      onChange={(e) => setMentorCount(e.target.value)}
                      placeholder="e.g. 15+"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="networkSize"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Network Size
                    </Label>
                    <Input
                      id="networkSize"
                      value={networkSize}
                      onChange={(e) => setNetworkSize(e.target.value)}
                      placeholder="e.g. Global Network (500+ Peers)"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="websiteUrl"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Website URL
                    </Label>
                    <Input
                      id="websiteUrl"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourstartupHub.com"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="startupHubQuote"
                    className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                  >
                    Tagline / Quote
                  </Label>
                  <Input
                    id="startupHubQuote"
                    value={startupHubQuote}
                    onChange={(e) => setStartupHubQuote(e.target.value)}
                    placeholder="We look for founders who are obsessed with solving hard problems at scale."
                    className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Headquarters Location
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    {/* Empty spacer */}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="programDuration"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Program Duration
                    </Label>
                    <Input
                      id="programDuration"
                      value={programDuration}
                      onChange={(e) => setProgramDuration(e.target.value)}
                      placeholder="e.g. 3 Months, 6 Months"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="equityTaken"
                      className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                    >
                      Equity / Terms
                    </Label>
                    <Input
                      id="equityTaken"
                      value={equityTaken}
                      onChange={(e) => setEquityTaken(e.target.value)}
                      placeholder="e.g. 7% Equity or No Equity"
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Sectors Focused */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest">
                    Focus Sectors / Industries
                  </Label>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {sectors.map((sector, index) => (
                      <Badge
                        key={index}
                        className="bg-[#1A1A2E] text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors cursor-pointer group"
                        onClick={() => setSectors(sectors.filter((s) => s !== sector))}
                      >
                        {sector}
                        <span className="text-[10px] font-light opacity-50 group-hover:opacity-100">×</span>
                      </Badge>
                    ))}
                    {sectors.length === 0 && (
                      <span className="text-xs text-[#1A1A2E]/20 self-center font-medium pl-1">
                        No sectors added yet. Add below.
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="new-sector"
                      placeholder="Type a sector (e.g. SaaS, Deeptech, Biotech, Web3) and press Enter"
                      className="bg-white border-[#1A1A2E]/5 h-11 rounded-full font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10 flex-1 shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !sectors.includes(val)) {
                            setSectors([...sectors, val]);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("new-sector") as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val && !sectors.includes(val)) {
                          setSectors([...sectors, val]);
                          input.value = "";
                        }
                      }}
                      className="h-11 px-4 bg-[#1A1A2E] text-white hover:bg-black font-bold uppercase tracking-widest text-[10px] rounded-full shadow-md"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* StartupHub Social Links */}
                <div className="space-y-4 pt-4 border-t border-[#1A1A2E]/5">
                  <div>
                    <h4 className="text-xs font-black text-[#1A1A2E] uppercase tracking-widest">
                      StartupHub Social Links
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Add the social channels for your startupHub program.
                    </p>
                  </div>

                  {/* Display current links */}
                  <div className="space-y-2">
                    {Object.entries(startupHubSocials).map(([platform, url]) => (
                      <div
                        key={platform}
                        className="flex items-center justify-between p-3 bg-[#F5F5EE]/40 border border-[#1A1A2E]/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/5 text-[#1A1A2E] flex items-center justify-center shrink-0">
                            {getPlatformIcon(platform)}
                          </div>
                          <span className="text-xs font-medium text-[#1A1A2E]/70 truncate max-w-[200px] sm:max-w-[350px]">
                            {url}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const copy = { ...startupHubSocials };
                            delete copy[platform];
                            setStartupHubSocials(copy);
                          }}
                          className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 font-bold text-xs uppercase"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                    {Object.keys(startupHubSocials).length === 0 && (
                      <p className="text-xs text-[#1A1A2E]/30 italic pl-1">
                        No startupHub social links added yet.
                      </p>
                    )}
                  </div>

                  {/* Add link form */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <select
                      id="social-platform"
                      className="h-11 rounded-full border-none bg-[#F5F5EE]/50 px-4 text-xs font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 appearance-none shadow-sm sm:w-40"
                      defaultValue="x"
                    >
                      <option value="x">X / Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                      <option value="discord">Discord</option>
                      <option value="website">Other Web</option>
                    </select>

                    <Input
                      id="social-url"
                      placeholder="Link URL or username (e.g. https://x.com/startup-hub)"
                      className="bg-white border-[#1A1A2E]/5 h-11 rounded-full font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10 flex-1 shadow-sm text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const selectEl = document.getElementById("social-platform") as HTMLSelectElement;
                          const inputEl = document.getElementById("social-url") as HTMLInputElement;
                          const platform = selectEl?.value;
                          const url = inputEl?.value.trim();
                          if (platform && url) {
                            setStartupHubSocials({
                              ...startupHubSocials,
                              [platform]: url,
                            });
                            inputEl.value = "";
                          }
                        }
                      }}
                    />

                    <Button
                      type="button"
                      onClick={() => {
                        const selectEl = document.getElementById("social-platform") as HTMLSelectElement;
                        const inputEl = document.getElementById("social-url") as HTMLInputElement;
                        const platform = selectEl?.value;
                        const url = inputEl?.value.trim();
                        if (platform && url) {
                          setStartupHubSocials({
                            ...startupHubSocials,
                            [platform]: url,
                          });
                          inputEl.value = "";
                        }
                      }}
                      className="h-11 px-4 bg-[#1A1A2E] text-white hover:bg-black font-bold uppercase tracking-widest text-[10px] rounded-full shadow-md shrink-0"
                    >
                      Add Link
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Button
              onClick={() => onSave()}
              className={cn(
                "w-full sm:w-auto px-10 h-12 sm:h-14 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                hasChanges
                  ? "bg-[#1A1A2E] text-white hover:bg-black"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              )}
              disabled={!hasChanges || isPending}
            >
              {isPending ? "Syncing Identity..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
