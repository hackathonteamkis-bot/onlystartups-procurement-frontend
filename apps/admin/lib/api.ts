import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlystartups-api.vercel.app';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await auth();
  const token = session?.accessToken; // We'll need to update session to include this

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    // For GET requests, cache for 30 seconds unless overridden
    ...(isGet && !options.next && !options.cache ? { next: { revalidate: 30 } } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = "API request failed";
    try {
      const error = text ? JSON.parse(text) : {};
      errorMessage = error.message || errorMessage;
    } catch (e) {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
