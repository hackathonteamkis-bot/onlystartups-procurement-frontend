"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const getSignedUploadUrl = async (filePath: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Security check: ensure the user is only uploading to their own directory!
  if (!filePath.startsWith(`${session.user.id}/`)) {
    return { error: "Forbidden: You can only upload files to your own directory." };
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("[STORAGE_ACTION] createSignedUploadUrl error:", error);
      return { error: error.message };
    }

    return {
      success: true,
      token: data.token,
      signedUrl: data.signedUrl,
    };
  } catch (error: any) {
    console.error("[STORAGE_ACTION] Unexpected error:", error);
    return { error: "Internal server error" };
  }
};
