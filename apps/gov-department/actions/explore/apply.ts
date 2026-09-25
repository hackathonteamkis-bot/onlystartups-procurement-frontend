"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const applyToGovDepartment = async (data: {
  govDepartmentId: string;
  programId?: string | null;
  message?: string;
  pitchUrl?: string;
  startupStage?: string;
  answers?: Record<string, any>;
}) => {
  const res = await fetchWithAuth('/applications/gov-department', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath(`/explore/gov-departments/${data.govDepartmentId}`);
  return res;
};

export const applyToGrant = async (data: {
  opportunityId: string;
  message: string;
}) => {
  return fetchWithAuth('/applications/funding-contract', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const applyToProgram = async (data: {
  programId: string;
  govDepartmentId: string;
  message?: string;
  pitchUrl?: string;
  startupStage?: string;
  answers?: Record<string, any>;
}) => {
  const res = await fetchWithAuth('/applications/problemStatement', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath(`/explore/gov-departments/${data.govDepartmentId}/programs/${data.programId}`);
  return res;
};



export const getGovDepartmentProgramApplications = async (programId: string) => {
  return fetchWithAuth(`/applications/problemStatement/${programId}`);
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
  return fetchWithAuth(`/applications/funding-contract/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};



export const getActiveProgram = async (govDepartmentId: string) => {
  try {
    return await fetchWithAuth(`/problemStatements/hub/${govDepartmentId}/active`);
  } catch (error) {
    return null;
  }
};

export const getPublicPrograms = async (govDepartmentId: string) => {
  try {
    return await fetchWithAuth(`/problemStatements/hub/${govDepartmentId}/public`);
  } catch (error) {
    return [];
  }
};
