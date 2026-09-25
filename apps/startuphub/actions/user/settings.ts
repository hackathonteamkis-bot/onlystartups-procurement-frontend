"use server";

import { fetchWithAuth } from "@/lib/api";
import { SettingSchema } from "@/schemas";
import * as z from "zod";

import { cookies } from "next/headers";

export const setLinkTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('link_token', token, { path: '/', maxAge: 300, sameSite: 'lax', httpOnly: true });
};

export const setting = async (values: z.infer<typeof SettingSchema>) => {
  try {
    const validatedFields = SettingSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    // Save to backend
    await fetchWithAuth('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(validatedFields.data),
    });

    // Fetch the updated profile so the client can pass it to
    // useSession().update({ user: freshUser }) for instant propagation.
    // This eliminates the need for hard refreshes after saving settings.
    try {
      const freshUser = await fetchWithAuth('/users/me', {
        cache: 'no-store',
      });
      return { success: "Profile Updated!", user: freshUser };
    } catch {
      // Even if the refetch fails, the save succeeded
      return { success: "Profile Updated!" };
    }
  } catch (error) {
    console.error("[SETTINGS_ACTION] Error:", error);
    return { error: "Something went wrong!" };
  }
};
