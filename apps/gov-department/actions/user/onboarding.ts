"use server";

import { OnboardingSchema } from "@/schemas";
import * as z from "zod";
import { fetchWithAuth } from "@/lib/api";

export const completeOnboarding = async (
  values: z.infer<typeof OnboardingSchema>,
) => {
  try {
    const validateFields = OnboardingSchema.safeParse(values);
    if (!validateFields.success) {
      return { error: "Invalid fields!" };
    }

    const res = await fetchWithAuth('/users/onboarding', {
      method: 'POST',
      body: JSON.stringify(validateFields.data),
    });

    return { success: "Onboarding completed!", user: res };
  } catch (error) {
    console.error("[ONBOARDING_ACTION] ERROR:", error);
    return { error: error instanceof Error ? error.message : "Something went wrong!" };
  }
};
