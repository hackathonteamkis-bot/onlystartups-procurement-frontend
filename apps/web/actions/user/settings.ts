"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const updateSettings = async (data: any) => {
  try {
    const result = await fetchWithAuth("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    
    if (result) {
      revalidatePath("/settings");
      revalidatePath("/profile");
    }
    return result;
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw error;
  }
};

export const setting = async (values: any) => {
  try {
    const result = await fetchWithAuth("/users/me", {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    
    if (result) {
      revalidatePath("/profile");
      return { success: "Settings updated", user: result };
    }
    return { error: "Failed to update settings" };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { error: error.message || "Failed to update settings" };
  }
};
