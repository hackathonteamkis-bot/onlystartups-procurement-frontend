"use server";

import * as z from "zod";
import { StartupHubAccessRequestSchema } from "@/schemas";

export const requestAccess = async (values: z.infer<typeof StartupHubAccessRequestSchema>) => {
  const validateFields = StartupHubAccessRequestSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${API_URL}/startup-hub/request-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validateFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Something went wrong" };
    }

    return { success: "Your request has been submitted successfully. We will be in touch soon!" };
  } catch (error) {
    console.error("REQUEST_ACCESS_ERROR", error);
    return { error: "Failed to connect to the server." };
  }
};
