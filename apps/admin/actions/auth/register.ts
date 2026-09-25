"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { confirmPassword, ...dataToSend } = validateFields.data;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlystartups-api.vercel.app';

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = "Something went wrong";
      if (typeof data.message === "string") {
        errorMessage = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        errorMessage = data.message[0];
      } else if (typeof data.error === "string") {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = String(data.message);
      }
      return { error: errorMessage };
    }

    return { success: data.success };
  } catch (error) {
    console.error("Register error:", error);
    return { error: "Internal server error" };
  }
};
