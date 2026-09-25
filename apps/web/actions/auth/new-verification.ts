"use server";

interface VerificationResponse {
  error?: string;
  success?: string;
}

export const newVerification = async (token: string): Promise<VerificationResponse> => {
  if (!token) {
    return { error: "Token is required!" };
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Something went wrong" };
    }

    return { success: data.success || "Email verified successfully!" };
  } catch (error) {
    console.error("Verification error:", error);
    return { error: "Internal server error" };
  }
}