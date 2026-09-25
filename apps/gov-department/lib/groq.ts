import OpenAI from "openai";

// Groq uses an OpenAI-compatible API
export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

// Using Llama 3.3 70B - Groq's fastest and most capable model
export const GROQ_MODEL = "llama-3.3-70b-versatile";
