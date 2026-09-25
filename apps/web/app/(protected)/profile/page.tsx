"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition, useEffect, useMemo, useRef } from "react";
import { Instagram, Linkedin } from "lucide-react";
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

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const hasInitialized = useRef(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [title, setTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const initialValues = useMemo(() => {
    if (!session?.user) return {} as Record<string, any>;
    return {
      firstName: session.user.firstName || "",
      lastName: session.user.lastName || "",
      bio: session.user.bio || "",
      twitter: session.user.twitter || "",
      linkedin: session.user.linkedin || "",
      instagram: session.user.instagram || "",
      title: session.user.title || "",
      yearsOfExperience: session.user.yearsOfExperience || "",
      skills: session.user.skills || [],
    };
  }, [session]);

  const hasChanges = useMemo(() => {
    return (
      firstName !== initialValues.firstName ||
      lastName !== initialValues.lastName ||
      bio !== initialValues.bio ||
      twitter !== initialValues.twitter ||
      linkedin !== initialValues.linkedin ||
      instagram !== initialValues.instagram ||
      title !== initialValues.title ||
      yearsOfExperience !== initialValues.yearsOfExperience ||
      JSON.stringify(skills) !== JSON.stringify(initialValues.skills)
    );
  }, [firstName, lastName, bio, twitter, linkedin, instagram, title, yearsOfExperience, skills, initialValues]);

  useEffect(() => {
    if (session?.user && !hasInitialized.current) {
      hasInitialized.current = true;
      const user = session.user;
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBio(user.bio || "");
      setTwitter(user.twitter || "");
      setLinkedin(user.linkedin || "");
      setInstagram(user.instagram || "");
      setTitle(user.title || "");
      setYearsOfExperience(user.yearsOfExperience || "");
      setSkills(user.skills || []);
    }
  }, [session]);

  const onSave = (additionalValues = {}) => {
    const savedData = {
      firstName,
      lastName,
      bio,
      twitter,
      linkedin,
      instagram,
      title,
      yearsOfExperience,
      skills,
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
            <CardTitle className="text-xl sm:text-2xl font-black tracking-tighter text-[#1A1A2E]">
              Profile Details
            </CardTitle>
            <CardDescription className="font-medium text-[#1A1A2E]/50">
              Update your public identity on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-5 sm:px-8 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  defaultValue={session?.user?.email || ""}
                  disabled
                  className="bg-[#1A1A2E]/5 border-none text-[#1A1A2E]/30 h-12 sm:h-14 rounded-full font-bold px-4"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                >
                  Professional Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    session?.user?.role === "STARTUP_HUB"
                      ? "e.g. Program Director, Venture Lead"
                      : "e.g. CEO & Founder, CTO"
                  }
                  className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-full font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="yearsOfExperience"
                  className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
                >
                  Years of Experience
                </Label>
                <div className="relative">
                  <select
                    id="yearsOfExperience"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full h-12 sm:h-14 rounded-full border-none bg-[#F5F5EE]/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#F26522]/10 appearance-none shadow-sm shadow-black/5"
                    disabled={isPending}
                  >
                    <option value="">Select experience level</option>
                    <option value="< 1 year">Less than 1 year</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest">
                Skills / Areas of Expertise
              </Label>
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-[#1A1A2E] text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors cursor-pointer group"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                  >
                    {skill}
                    <span className="text-[10px] font-light opacity-50 group-hover:opacity-100">×</span>
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <span className="text-xs text-[#1A1A2E]/20 self-center font-medium pl-1">
                    No skills added yet. Type below to add.
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  id="new-skill"
                  placeholder="Type a skill (e.g. React, Sales, Fundraising) and press Enter"
                  className="bg-white border-[#1A1A2E]/5 h-11 rounded-full font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10 flex-1 shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !skills.includes(val)) {
                        setSkills([...skills, val]);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("new-skill") as HTMLInputElement;
                    const val = input?.value.trim();
                    if (val && !skills.includes(val)) {
                      setSkills([...skills, val]);
                      input.value = "";
                    }
                  }}
                  className="h-11 px-4 bg-[#1A1A2E] text-white hover:bg-black font-bold uppercase tracking-widest text-[10px] rounded-full shadow-md"
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
              >
                {session?.user?.role === "STARTUP_HUB"
                  ? "StartupHub Manager Bio"
                  : "Founder Bio"}
              </Label>
              <textarea
                id="bio"
                rows={6}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[160px] rounded-xl border-none bg-[#F5F5EE]/50 px-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#F26522]/10 transition-all placeholder:text-[#1A1A2E]/20 shadow-inner"
                placeholder="Share your vision, your story, and why you are building what you are... our community connects through these stories."
                disabled={isPending}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1A1A2E]/5 bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden">
          <CardHeader className="px-5 sm:px-8">
            <CardTitle className="text-xl font-black tracking-tighter">
              Socials
            </CardTitle>
            <CardDescription className="font-medium">
              Connect your social profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 sm:px-8 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-black uppercase text-[#1A1A2E]/30 tracking-widest ml-1"
                  htmlFor="twitter"
                >
                  X (Twitter)
                </Label>
                <div className="flex items-center space-x-3 p-3 rounded-full bg-[#F5F5EE]/50 border border-transparent focus-within:border-[#F26522]/20 focus-within:bg-white transition-all shadow-inner hover:bg-sky-50">
                  <XLogo className="w-4 h-4 text-black" />
                  <Input
                    id="twitter"
                    value={twitter.replace(/^@/, "")}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="handle"
                    className="h-6 bg-transparent border-none text-sm p-0 focus-visible:ring-0 shadow-none font-black placeholder:text-[#1A1A2E]/10"
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-black uppercase text-[#1A1A2E]/30 tracking-widest ml-1"
                  htmlFor="linkedin"
                >
                  LinkedIn
                </Label>
                <div className="flex items-center space-x-3 p-3 rounded-full bg-[#F5F5EE]/50 border border-transparent focus-within:border-[#F26522]/20 focus-within:bg-white transition-all shadow-inner hover:bg-blue-50">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <Input
                    id="linkedin"
                    value={linkedin
                      .replace(/.*\/(in|company)\//, "")
                      .replace(/\/$/, "")}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="username"
                    className="h-6 bg-transparent border-none text-sm p-0 focus-visible:ring-0 shadow-none font-black placeholder:text-[#1A1A2E]/10"
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-black uppercase text-[#1A1A2E]/30 tracking-widest ml-1"
                  htmlFor="instagram"
                >
                  Instagram
                </Label>
                <div className="flex items-center space-x-3 p-3 rounded-full bg-[#F5F5EE]/50 border border-transparent focus-within:border-[#F26522]/20 focus-within:bg-white transition-all shadow-inner hover:bg-pink-50">
                  <Instagram className="w-4 h-4 text-[#E1306C]" />
                  <Input
                    id="instagram"
                    value={instagram.replace(/^@/, "")}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="handle"
                    className="h-6 bg-transparent border-none text-sm p-0 focus-visible:ring-0 shadow-none font-black placeholder:text-[#1A1A2E]/10"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => onSave()}
          className={cn(
            "w-full h-12 sm:h-14 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
            hasChanges
              ? "bg-[#1A1A2E] text-white hover:bg-black active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
          disabled={!hasChanges || isPending}
        >
          {isPending ? "Syncing Identity..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
