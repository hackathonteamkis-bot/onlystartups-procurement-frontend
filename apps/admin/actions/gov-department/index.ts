"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getGovDepartmentData = async () => {
  return fetchWithAuth('/gov-department/data');
};

export const getGovDepartmentStats = async () => {
  return fetchWithAuth('/gov-department/stats');
};

export const createFundingOpportunity = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/gov-department/funding-opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateFundingOpportunity = async (schemeId: string, data: Record<string, unknown>) => {
  return fetchWithAuth(`/gov-department/funding-opportunities/${schemeId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const createResource = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/gov-department/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const scheduleMentorSession = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/gov-department/mentor-sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateMentorSessionStatus = async (sessionId: string, status: string) => {
  return fetchWithAuth(`/gov-department/mentor-sessions/${sessionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const addStartup = async (data: { email: string; name: string }) => {
  return fetchWithAuth('/gov-department/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const removeStartup = async (startupId: string) => {
  const result = await fetchWithAuth(`/gov-department/portfolio/${startupId}`, {
    method: 'DELETE',
  });
  revalidatePath('/gov-department/portfolio');
  return result;
};

export const getStartupDetails = async (startupId: string) => {
  return fetchWithAuth(`/gov-department/portfolio/${startupId}`);
};

export const deleteFundingOpportunity = async (schemeId: string) => {
  try {
    const result = await fetchWithAuth(`/gov-department/funding-opportunities/${schemeId}`, {
      method: 'DELETE',
    });
    revalidatePath('/gov-department/funding-opportunities');
    revalidatePath('/gov-department/dashboard');
    return result;
  } catch (error: any) {
    return { error: error.message || "Failed to delete funding opportunity" };
  }
};


