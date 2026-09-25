"use server";

import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
    if(!token){
        return { error : "Token is missing!"}
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if(!validatedFields.success){
        return {error : "Invalid Fields"}
    }
    
    const { password } = validatedFields.data;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlystartups-api.vercel.app';

    try {
        const response = await fetch(`${API_URL}/auth/new-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, token }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Something went wrong" };
        }

        return { success : "Password Updated!"}
    } catch (error) {
        console.error("New password error:", error);
        return { error: "Internal server error" };
    }
};
