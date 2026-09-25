"use server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlystartups-api.vercel.app';

export const getPendingHubRequests = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/admin/hub-requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { error: "Failed to fetch hub requests" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("GET_HUB_REQUESTS_ERROR", error);
    return { error: "Failed to connect to the server." };
  }
};

export const approveHubRequest = async (id: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/admin/hub-requests/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { error: "Failed to approve hub request" };
    }

    const data = await res.json();
    revalidatePath("/admin/hub-requests");
    return { success: true, data };
  } catch (error) {
    console.error("APPROVE_HUB_REQUEST_ERROR", error);
    return { error: "Failed to connect to the server." };
  }
};

export const rejectHubRequest = async (id: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/admin/hub-requests/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return { error: "Failed to reject hub request" };

    revalidatePath("/admin/hub-requests");
    return { success: true };
  } catch (error) {
    console.error("REJECT_HUB_REQUEST_ERROR", error);
    return { error: "Failed to connect to the server." };
  }
};

export const blockHubRequest = async (id: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/admin/hub-requests/${id}/block`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return { error: "Failed to block hub request" };

    revalidatePath("/admin/hub-requests");
    return { success: true };
  } catch (error) {
    console.error("BLOCK_HUB_REQUEST_ERROR", error);
    return { error: "Failed to connect to the server." };
  }
};
