"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@onlystartups/ui";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { setting } from "@/actions/user/settings";
import { getSignedUploadUrl } from "@/actions/user/storage";
import imageCompression from "browser-image-compression";

export function ProfileHeader() {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [localBannerUrl, setLocalBannerUrl] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const imageUrl = localAvatarUrl || session?.user?.image || "";
  const bannerUrl = localBannerUrl || session?.user?.bannerImage || "";

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    // Optimistic UI update
    const objectUrl = URL.createObjectURL(file);
    if (type === "avatar") setLocalAvatarUrl(objectUrl);
    else setLocalBannerUrl(objectUrl);


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
        setting({ image: publicUrl }).then((data) => {
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
        setBannerError(false);
        setting({ bannerImage: publicUrl }).then((data) => {
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

  return (
    <>
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

      <div className="relative pt-4 sm:pt-0 mb-8">
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
                    (session?.user?.role === "GOV_DEPARTMENT"
                      ? "GovDepartment"
                      : "Founder")}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
