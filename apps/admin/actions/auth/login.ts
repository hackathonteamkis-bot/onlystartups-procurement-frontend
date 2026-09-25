"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

    if (data?.user && data.user.role !== 'ADMIN') {
      return { error: "You do not have access to the Admin portal." };
    }

    if (data.twoFactor) {
      return { twoFactor: true };
    }

    if (data.success && data.success.includes("Confirmation email")) {
      return { success: data.success };
    }

    // Establish the NextAuth session cookie.
    // With redirect: false, signIn returns the redirect URL as a string
    // instead of throwing NEXT_REDIRECT. We inspect the URL to determine
    // success (dashboard URL) vs failure (error page URL).
    const result = await signIn("credentials", {
      backendResponse: JSON.stringify(data),
      redirect: false,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    // If result contains an error page URL, the sign-in failed
    if (typeof result === "string" && result.includes("/auth/error")) {
      return { error: "Unable to establish session. Please try again later." };
    }

    return { success: "LOGIN_SUCCESS" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        case "AccessDenied":
          return { error: "You do not have access to the Admin portal." };
        default:
          return { error: "Unable to establish session. Please try again later." };
      }
    }
    // NEXT_REDIRECT — let Next.js handle it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Login error:", error);
    return { error: "Internal server error" };
  }
};

