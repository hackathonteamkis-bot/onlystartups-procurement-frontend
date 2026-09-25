"use client";


import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useTransition, useEffect, useRef, useMemo, useCallback } from "react";
import {
  User,
  Camera,
  Bell,
  KeyRound,
  Instagram,
  Twitter,
  Linkedin,
  Rocket,
  Loader2,
  ChevronRight,
  Mail,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Switch } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@onlystartups/ui";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@onlystartups/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@onlystartups/ui";
import { Separator } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { setting } from "@/actions/user/settings";
import { reset } from "@/actions/auth/reset";
import {
  deleteAccount,
  initiateTwoFactorToggle,
  confirmTwoFactorToggle,
} from "@/actions/user/security";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { getSignedUploadUrl } from "@/actions/user/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import imageCompression from "browser-image-compression";

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 sm:pb-10 pt-4 sm:pt-8 w-full animate-in fade-in duration-500">
      {/* Profile Header Skeleton */}
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
        {/* Tabs Skeleton */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 w-full">
          <div className="flex gap-2 flex-1">
            <Skeleton className="h-10 sm:h-12 w-28 sm:w-32 rounded-lg" />
            <Skeleton className="h-10 sm:h-12 w-28 sm:w-32 rounded-lg" />
          </div>
          <Skeleton className="h-[46px] sm:h-[54px] w-[46px] sm:w-[54px] rounded-xl shrink-0" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6 w-full">
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
    </div>
  );
}

const getPlatformIcon = (platform: string) => {
  const normalized = platform.toLowerCase();
  switch (normalized) {
    case "x":
    case "twitter":
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
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

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [is2FAConfirmOpen, setIs2FAConfirmOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resetCooldown > 0) {
      interval = setInterval(() => {
        setResetCooldown((current) => current - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resetCooldown]);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [startupName, setStartupName] = useState("");
  const [startupDescription, setStartupDescription] = useState("");
  const [startupPhase, setStartupPhase] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [title, setTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // StartupHub profile fields
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

  // Memoize initial values to track changes
  const initialValues = useMemo(() => {
    if (!session?.user) return {} as Record<string, any>;
    return {
      firstName: session.user.firstName || "",
      lastName: session.user.lastName || "",
      bio: session.user.bio || "",
      twitter: session.user.twitter || "",
      linkedin: session.user.linkedin || "",
      instagram: session.user.instagram || "",
      startupName: session.user.startupName || "",
      startupDescription: session.user.startupDescription || "",
      startupPhase: session.user.startupPhase || "",
      imageUrl: session.user.image || "",
      bannerUrl: session.user.bannerImage || "",
      activeStartups: session.user.activeStartups || "",
      totalExits: session.user.totalExits || "",
      fundingRaised: session.user.fundingRaised || "",
      mentorCount: session.user.mentorCount || "",
      networkSize: session.user.networkSize || "",
      startupHubQuote: session.user.startupHubQuote || "",
      websiteUrl: session.user.websiteUrl || "",
      title: session.user.title || "",
      yearsOfExperience: session.user.yearsOfExperience || "",
      skills: session.user.skills || [],
      location: session.user.location || "",
      sectors: session.user.sectors || [],
      programDuration: session.user.programDuration || "",
      equityTaken: session.user.equityTaken || "",
      startupHubSocials: session.user.startupHubSocials || {},
    };
  }, [session]);

  // Track if any field has changed
  const hasChanges = useMemo(() => {
    return (
      firstName !== initialValues.firstName ||
      lastName !== initialValues.lastName ||
      bio !== initialValues.bio ||
      twitter !== initialValues.twitter ||
      linkedin !== initialValues.linkedin ||
      instagram !== initialValues.instagram ||
      startupName !== initialValues.startupName ||
      startupDescription !== initialValues.startupDescription ||
      startupPhase !== initialValues.startupPhase ||
      imageUrl !== initialValues.imageUrl ||
      bannerUrl !== initialValues.bannerUrl ||
      activeStartups !== initialValues.activeStartups ||
      totalExits !== initialValues.totalExits ||
      fundingRaised !== initialValues.fundingRaised ||
      mentorCount !== initialValues.mentorCount ||
      networkSize !== initialValues.networkSize ||
      startupHubQuote !== initialValues.startupHubQuote ||
      websiteUrl !== initialValues.websiteUrl ||
      title !== initialValues.title ||
      yearsOfExperience !== initialValues.yearsOfExperience ||
      JSON.stringify(skills) !== JSON.stringify(initialValues.skills) ||
      location !== initialValues.location ||
      JSON.stringify(sectors) !== JSON.stringify(initialValues.sectors) ||
      programDuration !== initialValues.programDuration ||
      equityTaken !== initialValues.equityTaken ||
      JSON.stringify(startupHubSocials) !== JSON.stringify(initialValues.startupHubSocials)
    );
  }, [
    firstName,
    lastName,
    bio,
    twitter,
    linkedin,
    instagram,
    startupName,
    startupDescription,
    startupPhase,
    imageUrl,
    bannerUrl,
    activeStartups,
    totalExits,
    fundingRaised,
    mentorCount,
    networkSize,
    startupHubQuote,
    websiteUrl,
    title,
    yearsOfExperience,
    skills,
    location,
    sectors,
    programDuration,
    equityTaken,
    startupHubSocials,
    initialValues,
  ]);

  // Initialize form states from session   only once on first load.
  // Using a ref prevents the "prev ||" pattern that blocks clearing fields.
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
      setStartupName(user.startupName || "");
      setStartupDescription(user.startupDescription || "");
      setStartupPhase(user.startupPhase || "");
      setImageUrl(user.image || "");
      setBannerUrl(user.bannerImage || "");
      setTitle(user.title || "");
      setYearsOfExperience(user.yearsOfExperience || "");
      setSkills(user.skills || []);

      // StartupHub fields
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
      firstName,
      lastName,
      bio,
      twitter,
      linkedin,
      instagram,
      startupName,
      startupDescription,
      startupPhase,
      image: imageUrl,
      bannerImage: bannerUrl,
      activeStartups,
      totalExits,
      fundingRaised,
      mentorCount,
      networkSize,
      startupHubQuote,
      websiteUrl,
      title,
      yearsOfExperience,
      skills,
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
            // Use fresh server data if available, otherwise fall back to local data
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    const objectUrl = URL.createObjectURL(file);
    if (type === "avatar") setImageUrl(objectUrl);
    else setBannerUrl(objectUrl);


    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const loadingToast = toast.loading(`Uploading ${type}...`);

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${session.user.id}/${type}/${fileName}`;

      const signedRes = await getSignedUploadUrl(filePath);
      if (signedRes.error || !signedRes.signedUrl || !signedRes.token) {
        throw new Error(signedRes.error || "Failed to generate signed upload URL");
      }

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .uploadToSignedUrl(filePath, signedRes.token, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      if (type === "avatar") {
        setImageUrl(publicUrl);
        setting({
          image: publicUrl,
        }).then((data) => {
          if (data.success) {
            update({ user: { image: publicUrl } });
            toast.dismiss(loadingToast);
            toast.success("Profile picture updated!");
          } else {
            toast.dismiss(loadingToast);
            toast.error(data.error || "Failed to update profile picture");
          }
        });
      } else {
        setBannerUrl(publicUrl);
        setBannerError(false);
        setting({
          bannerImage: publicUrl,
        }).then((data) => {
          if (data.success) {
            update({ user: { bannerImage: publicUrl } });
            toast.dismiss(loadingToast);
            toast.success("Banner image updated!");
          } else {
            toast.dismiss(loadingToast);
            toast.error(data.error || "Failed to update banner image");
          }
        });
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleTabSwitch = (id: string) => {
    setActiveTab(id);
    setIsMoreOpen(false);
  };

  const isHiddenTabActive =
    activeTab === "security" || activeTab === "notifications";

  const onResetPassword = () => {
    if (!session?.user?.email || resetCooldown > 0) return;

    startTransition(() => {
      reset({ email: session.user.email as string })
        .then((data) => {
          if (data.error) toast.error(data.error);
          else if (data.success) {
            toast.success(data.success);
            setResetCooldown(60);
          }
        })
        .catch((e) => toast.error(e.message || "Something went wrong"));
    });
  };

  const onInitiate2FA = () => {
    startTransition(() => {
      initiateTwoFactorToggle()
        .then((data) => {
          if (data.error) toast.error(data.error);
          else if (data.success) {
            toast.success(data.success);
            setIs2FAConfirmOpen(true);
          }
        })
        .catch((e) => toast.error(e.message || "Failed to initiate 2FA"));
    });
  };

  const onConfirm2FA = () => {
    if (!twoFactorCode) return;

    startTransition(() => {
      confirmTwoFactorToggle(twoFactorCode)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else if (data.success) {
            const newState = !session?.user?.isTwoFactorEnabled;
            update({ user: { isTwoFactorEnabled: newState } });
            toast.success(data.success);
            setIs2FAConfirmOpen(false);
            setTwoFactorCode("");
          }
        })
        .catch((e) => toast.error(e.message || "Invalid or expired code"));
    });
  };

  const onDeleteAccount = () => {
    startTransition(() => {
      deleteAccount()
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Account deleted successfully.");
            signOut({ callbackUrl: window.location.origin });
          }
        })
        .catch((e) => toast.error(e.message || "Failed to delete account"));
    });
  };

  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 sm:pb-10">
      <input
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "avatar")}
      />
      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "banner")}
      />

      {/* Profile Header */}
      <div className="relative pt-4 sm:pt-0">
        <div className="h-32 sm:h-48 lg:h-56 w-full bg-gradient-to-r from-[#F26522]/20 to-[#1A1A2E]/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner relative">
          {bannerUrl && !bannerError ? (
            <Image
              src={bannerUrl}
              alt="Banner"
              fill
              className="object-cover"
              onError={() => setBannerError(true)}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-grid-[#1A1A2E]/[0.02] bg-[size:20px_20px]" />
          )}

          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-black/40 text-white rounded-full transition-opacity hover:bg-black/60 z-10"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-end px-4 sm:px-10 -mt-10 sm:-mt-16 sm:space-x-6 relative z-10 text-center sm:text-left">
          <div className="relative group/avatar shrink-0 mb-3 sm:mb-0">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 border-4 border-[#F5F5EE] shadow-2xl mx-auto sm:mx-0">
              <AvatarImage src={imageUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-[#1A1A2E] text-white text-xl sm:text-2xl font-black italic">
                {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim()?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-2 bg-[#F26522] text-white rounded-full shadow-lg border-2 border-[#F5F5EE] hover:bg-[#D55516] transition-colors"
              disabled={isUploading}
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="mt-4 sm:mt-0 pb-2 text-center sm:text-left flex-1 min-w-0">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#1A1A2E] tracking-tight truncate flex items-center justify-center sm:justify-start gap-2">
              {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || "Member"}
              {session?.user?.role === "ADMIN" && (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0 h-5 text-[10px] font-black tracking-widest hidden sm:flex">
                  PRO
                </Badge>
              )}
            </h1>
            <div className="mt-0.5 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3">
              <p className="text-[#1A1A2E]/60 text-xs sm:text-sm font-bold tracking-tight">
                {session?.user?.email || ""}
              </p>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#1A1A2E]/20" />
                <Badge
                  variant="secondary"
                  className="bg-[#F26522]/10 text-[#F26522] border-none whitespace-nowrap text-[9px] sm:text-xs font-black uppercase tracking-widest px-2 py-0.5"
                >
                  {session?.user?.startupName ||
                    (session?.user?.role === "STARTUP_HUB"
                      ? "StartupHub"
                      : "Founder")}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8 sticky top-2 z-40 sm:static">
            <TabsList className="bg-white/70 backdrop-blur-xl border border-[#1A1A2E]/5 rounded-xl p-1 flex items-center justify-start h-auto shadow-sm gap-1.5 flex-1">
              {[
                { id: "account", label: "Account", icon: User },
                {
                  id: "startup",
                  label:
                    session?.user?.role === "STARTUP_HUB"
                      ? "StartupHub Profile"
                      : "Startup",
                  icon: Rocket,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="shrink-0 sm:flex-1 rounded-lg sm:rounded-lg data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-md border-none px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all min-w-[100px] sm:min-w-0"
                >
                  <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2 mb-0.5 sm:mb-0 block sm:inline-block mx-auto sm:mx-0" />
                  <span className="block sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <DropdownMenu open={isMoreOpen} onOpenChange={setIsMoreOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-[46px] sm:h-[54px] w-[46px] sm:w-[54px] rounded-full border-[#1A1A2E]/5 bg-white/70 backdrop-blur-xl shrink-0 shadow-sm flex items-center justify-center p-0 transition-all group hover:bg-[#1A1A2E] hover:border-none",
                    isHiddenTabActive && "bg-[#1A1A2E] border-none",
                  )}
                >
                  <div className="flex gap-0.5">
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full transition-colors",
                        isHiddenTabActive
                          ? "bg-white"
                          : "bg-[#1A1A2E]/40 group-hover:bg-white",
                      )}
                    />
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full transition-colors",
                        isHiddenTabActive
                          ? "bg-white"
                          : "bg-[#1A1A2E]/40 group-hover:bg-white",
                      )}
                    />
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full transition-colors",
                        isHiddenTabActive
                          ? "bg-white"
                          : "bg-[#1A1A2E]/40 group-hover:bg-white",
                      )}
                    />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-[280px] sm:w-[300px] rounded-2xl bg-white border border-[#1A1A2E]/5 shadow-2xl p-2 overflow-hidden">
                <div className="p-2 space-y-1">
                  {[
                    {
                      id: "security",
                      icon: KeyRound,
                      title: "Security Settings",
                      desc: "Credentials & Auth",
                    },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleTabSwitch(item.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group outline-none",
                        activeTab === item.id
                          ? "bg-[#1A1A2E] text-white shadow-md focus:bg-[#1A1A2E] focus:text-white"
                          : "hover:bg-[#F5F5EE] hover:shadow-sm focus:bg-[#F5F5EE]",
                      )}
                    >
                      <div
                        className={cn(
                          "p-2.5 rounded-xl flex items-center justify-center transition-all",
                          activeTab === item.id
                            ? "bg-white/10 text-white"
                            : "bg-[#1A1A2E]/5 text-[#1A1A2E]",
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.title}</p>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            activeTab === item.id
                              ? "text-white/40"
                              : "text-[#1A1A2E]/40",
                          )}
                        >
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4",
                          activeTab === item.id
                            ? "text-white/20"
                            : "text-[#1A1A2E]/20",
                        )}
                      />
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value="account" className="space-y-6 outline-none">
            <Card className="border-[#1A1A2E]/5 bg-white shadow-xl shadow-[#1A1A2E]/5 rounded-xl sm:rounded-2xl overflow-hidden border-t-0">
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
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10"
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
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10"
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
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold px-4 focus-visible:ring-4 focus-visible:ring-[#F26522]/10"
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
                        className="w-full h-12 sm:h-14 rounded-xl border-none bg-[#F5F5EE]/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#F26522]/10 appearance-none shadow-sm shadow-black/5"
                        disabled={isPending}
                      >
                        <option value="">Select experience level</option>
                        <option value="< 1 year">Less than 1 year</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1A1A2E]/20">
                        <User className="w-4 h-4 mr-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest">
                    Skills / Areas of Expertise
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 min-h-[50px] bg-[#F5F5EE]/50 rounded-xl border border-transparent shadow-inner">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-[#1A1A2E] text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors cursor-pointer group"
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
                      className="h-11 px-4 bg-[#1A1A2E] text-white hover:bg-black font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-md"
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
                      ? "StartupHub Bio / Manager Bio"
                      : "Startup Vision / Bio"}
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

            <Card className="border-[#1A1A2E]/5 bg-white shadow-xl shadow-[#1A1A2E]/5 rounded-xl sm:rounded-2xl overflow-hidden">
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
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F5EE]/50 border border-transparent focus-within:border-[#F26522]/20 focus-within:bg-white transition-all shadow-inner hover:bg-sky-50">
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
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F5EE]/50 border border-transparent focus-within:border-[#F26522]/20 focus-within:bg-white transition-all shadow-inner hover:bg-blue-50">
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
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F5EE]/50 border border-transparent focus-within:border-[#F26522]/20 focus-within:bg-white transition-all shadow-inner hover:bg-pink-50">
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
                  ? "bg-[#1A1A2E] text-white hover:bg-black shadow-xl shadow-[#1A1A2E]/20 active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              )}
              disabled={!hasChanges || isPending || isUploading}
            >
              {isPending ? "Syncing Identity..." : "Save Changes"}
            </Button>
          </TabsContent>

          <TabsContent value="startup" className="outline-none">
            <Card className="border-[#1A1A2E]/5 bg-white shadow-xl shadow-[#1A1A2E]/5 rounded-xl sm:rounded-2xl overflow-hidden">
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
                      className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                        className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="w-full h-12 sm:h-14 rounded-xl border-none bg-[#F5F5EE]/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#F26522]/10 appearance-none shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                        className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
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
                          className="bg-[#F5F5EE]/50 border-none h-12 sm:h-14 rounded-xl font-bold focus-visible:ring-4 focus-visible:ring-[#F26522]/10 shadow-sm"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    {/* Sectors Focused */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest">
                        Focus Sectors / Industries
                      </Label>
                      <div className="flex flex-wrap gap-2 p-3 min-h-[50px] bg-[#F5F5EE]/50 rounded-xl border border-transparent shadow-inner">
                        {sectors.map((sector, index) => (
                          <Badge
                            key={index}
                            className="bg-[#1A1A2E] text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors cursor-pointer group"
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
                          className="h-11 px-4 bg-[#1A1A2E] text-white hover:bg-black font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-md"
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
                              <div className="w-8 h-8 rounded-lg bg-[#1A1A2E]/5 text-[#1A1A2E] flex items-center justify-center shrink-0">
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
                          className="h-11 rounded-xl border-none bg-[#F5F5EE]/50 px-4 text-xs font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 appearance-none shadow-sm sm:w-40"
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
                          className="h-11 px-4 bg-[#1A1A2E] text-white hover:bg-black font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-md shrink-0"
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
                      ? "bg-[#1A1A2E] text-white hover:bg-black shadow-xl shadow-[#1A1A2E]/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                  )}
                  disabled={!hasChanges || isPending}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="outline-none">
            <Card className="border-[#1A1A2E]/5 bg-white shadow-xl shadow-[#1A1A2E]/5 rounded-xl overflow-hidden">
              <div className="p-6 sm:p-10 space-y-0">
                {/* Row 1: Password */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 first:pt-0 border-b border-[#1A1A2E]/5">
                  <div className="flex items-start gap-0">
                    <div className="space-y-1">
                      <h3 className="font-black text-lg tracking-tight">
                        Security Credentials
                      </h3>
                      <p className="text-sm font-medium text-[#1A1A2E]/50">
                        Update your login password and access tokens.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onResetPassword}
                    disabled={isPending || resetCooldown > 0}
                    variant="outline"
                    className="sm:w-48 h-12 rounded-xl font-bold text-xs uppercase tracking-widest border-[#1A1A2E]/10"
                  >
                    {resetCooldown > 0
                      ? `Retry in ${resetCooldown}s`
                      : "Reset Password"}
                  </Button>
                </div>

                {/* Row 2: 2FA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-b border-[#1A1A2E]/5">
                  <div className="flex items-start gap-0">
                    <div className="space-y-1">
                      <h3 className="font-black text-lg tracking-tight">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm font-medium text-[#1A1A2E]/50">
                        Add an extra layer of security to your founder account.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!!session?.user?.isTwoFactorEnabled}
                    onCheckedChange={onInitiate2FA}
                    disabled={isPending}
                  />
                </div>

                {/* Row 3: Delete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 last:pb-0">
                  <div className="flex items-start gap-0">
                    <div className="space-y-1">
                      <h3 className="font-black text-lg tracking-tight text-red-500/80">
                        Account Termination
                      </h3>
                      <p className="text-sm font-medium text-[#1A1A2E]/50">
                        Permanently delete your account and all associated
                        startup data.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant="ghost"
                    className="sm:w-48 h-12 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500/60 hover:text-red-600 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl bg-[#F5F5EE] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-[#1A1A2E]">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-[#1A1A2E]/60">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-none bg-[#1A1A2E]/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs h-10"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={is2FAConfirmOpen} onOpenChange={setIs2FAConfirmOpen}>
        <DialogContent className="rounded-xl bg-[#F5F5EE] border-none shadow-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#F26522]" />
              Verify 2FA Request
            </DialogTitle>
            <DialogDescription className="font-medium text-[#1A1A2E]/60">
              We&apos;ve sent a 6-digit code to your registered email. Enter it
              below to{" "}
              {session?.user?.isTwoFactorEnabled ? "disable" : "enable"}{" "}
              two-factor authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-[10px] font-black text-[#1A1A2E]/40 uppercase ml-1 tracking-widest"
              >
                Verification Code
              </Label>
              <Input
                id="code"
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="h-14 rounded-2xl border-none bg-white font-black text-center text-2xl tracking-[0.5em] focus:ring-4 focus:ring-[#F26522]/10 transition-all shadow-sm"
                maxLength={6}
              />
            </div>
            <Button
              onClick={onConfirm2FA}
              disabled={isPending || twoFactorCode.length !== 6}
              className="w-full h-14 rounded-full bg-[#1A1A2E] hover:bg-black text-white font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-[#1A1A2E]/10"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Confirm Verification"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
