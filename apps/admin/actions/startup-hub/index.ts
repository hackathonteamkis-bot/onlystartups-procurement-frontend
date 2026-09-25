"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getStartupHubData = async () => {
  return fetchWithAuth('/startup-hub/data');
};

export const getStartupHubStats = async () => {
  return fetchWithAuth('/startup-hub/stats');
};

export const createFundingOpportunity = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/startup-hub/funding-opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateFundingOpportunity = async (schemeId: string, data: Record<string, unknown>) => {
  return fetchWithAuth(`/startup-hub/funding-opportunities/${schemeId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const createResource = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/startup-hub/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const scheduleMentorSession = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/startup-hub/mentor-sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateMentorSessionStatus = async (sessionId: string, status: string) => {
  return fetchWithAuth(`/startup-hub/mentor-sessions/${sessionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const addStartup = async (data: { email: string; name: string }) => {
  return fetchWithAuth('/startup-hub/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const removeStartup = async (startupId: string) => {
  const result = await fetchWithAuth(`/startup-hub/portfolio/${startupId}`, {
    method: 'DELETE',
  });
  revalidatePath('/startup-hub/portfolio');
  return result;
};

export const getStartupDetails = async (startupId: string) => {
  return fetchWithAuth(`/startup-hub/portfolio/${startupId}`);
};

export const deleteFundingOpportunity = async (schemeId: string) => {
  try {
    const result = await fetchWithAuth(`/startup-hub/funding-opportunities/${schemeId}`, {
      method: 'DELETE',
    });
    revalidatePath('/startup-hub/funding-opportunities');
    revalidatePath('/startup-hub/dashboard');
    return result;
  } catch (error: any) {
    return { error: error.message || "Failed to delete funding opportunity" };
  }
};


