"use server"

import * as z from "zod"
import { ResetSchema } from "@/schemas"

export const reset = async(values : z.infer<typeof ResetSchema> )=> {
    const validatedFields = ResetSchema.safeParse(values)

    if(!validatedFields.success){
        return { error : "Invalid email!" }
    }

    const { email } = validatedFields.data
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlystartups-api.vercel.app';

    try {
        const response = await fetch(`${API_URL}/auth/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Something went wrong" };
        }

        return { success: data.success };
    } catch (error) {
        console.error("Reset error:", error);
        return { error: "Internal server error" };
    }
}