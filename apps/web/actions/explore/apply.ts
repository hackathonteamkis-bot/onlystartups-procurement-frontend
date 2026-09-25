"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const applyToStartupHub = async (data: {
  startupHubId: string;
  message?: string;
  pitchUrl?: string;
  startupStage?: string;
  answers?: Record<string, any>;
}) => {
  const res = await fetchWithAuth('/applications/startup-hub', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath(`/explore/startup-hubs/${data.startupHubId}`);
  return res;
};

export const applyToGrant = async (data: {
  opportunityId: string;
  message: string;
}) => {
  return fetchWithAuth('/applications/funding-opportunity', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const applyToProgram = async (data: {
  programId: string;
  startupHubId: string;
  message?: string;
  pitchUrl?: string;
  startupStage?: string;
  answers?: Record<string, any>;
}) => {
  const res = await fetchWithAuth('/applications/program', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath(`/explore/startup-hubs/${data.startupHubId}/programs/${data.programId}`);
  return res;
};

export const getStartupHubApplications = async () => {
  return fetchWithAuth('/applications/startup-hub');
};

export const getApplicationsData = async () => {
  return fetchWithAuth('/applications/me');
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: "APPROVED" | "REJECTED",
) => {
  return fetchWithAuth(`/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const updateFundingOpportunityApplicationStatus = async (
  applicationId: string,
  status: "APPROVED" | "REJECTED",
) => {
  return fetchWithAuth(`/applications/funding-opportunity/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getApplicationById = async (applicationId: string) => {
  try {
    return await fetchWithAuth(`/applications/${applicationId}`);
  } catch (error) {
    console.error("Error fetching application details:", error);
    return null;
  }
};

export const getActiveProgram = async (startupHubId: string) => {
  try {
    return await fetchWithAuth(`/programs/hub/${startupHubId}/active`);
  } catch (error) {
    return null;
  }
};

export const getPublicPrograms = async (startupHubId: string) => {
  try {
    return await fetchWithAuth(`/programs/hub/${startupHubId}/public`);
  } catch (error) {
    return [];
  }
};
