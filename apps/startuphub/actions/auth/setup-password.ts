"use server";

import { fetchWithAuth } from "@/lib/api";

export const setupPassword = async (values: {
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const data = await fetchWithAuth("/auth/setup-password", {
      method: "POST",
      body: JSON.stringify(values),
    });

    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { error: message };
  }
};
