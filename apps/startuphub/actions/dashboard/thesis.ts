"use server";

import { fetchWithAuth } from "@/lib/api";

export const generateFounderThesis = async (userId?: string) => {
  try {
    return await fetchWithAuth('/matching/generate-thesis', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error("[GENERATE_THESIS_ERROR]", error);
    return { error: "Something went wrong" };
  }
};
