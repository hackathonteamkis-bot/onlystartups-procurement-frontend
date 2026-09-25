"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlystartups-api.vercel.app';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validateFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = "Something went wrong";
      if (typeof data.message === "string") {
        errorMessage = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        errorMessage = data.message[0];
      } else if (data.details) {
        errorMessage = `${data.error}: ${data.details}`;
      } else if (typeof data.error === "string") {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = String(data.message);
      }
      return { error: errorMessage };
    }

    if (data?.user && data.user.role !== 'GOV_DEPARTMENT') {
      return { error: "You do not have access to the Startup Hub portal." };
    }

    if (data.twoFactor) {
      return { twoFactor: true };
    }

    if (data.success && data.success.includes("Confirmation email")) {
      return { success: data.success };
    }

    // Check if user needs to change their temporary password
    const needsPasswordChange = data?.user?.needsPasswordChange;

    // If we reach here, we have a successful login with access_token
    // We still need to call NextAuth signIn to establish the local session cookie
    try {
      await signIn("credentials", {
        backendResponse: JSON.stringify(data),
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Unable to establish session. Please try again later." };
      }
      throw error; // Rethrow NEXT_REDIRECT error
    }

    // Redirect to setup-password if user has a temporary password
    if (needsPasswordChange) {
      return { success: "NEEDS_PASSWORD_CHANGE" };
    }

    return { success: "LOGIN_SUCCESS" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Unable to establish session. Please try again later." };
    }
    // If it's a redirect error thrown by Next.js, we MUST rethrow it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Login error:", error);
    return { error: "Internal server error" };
  }
};
