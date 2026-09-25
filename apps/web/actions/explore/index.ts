"use server";

import { fetchWithAuth } from "@/lib/api";

export const getExploreData = async () => {
  try {
    return await fetchWithAuth('/explore');
  } catch (error) {
    console.error("Error fetching explore data:", error);
    return {
      govDepartments: [],
      resources: [],
      fundingOpportunities: [],
      events: [],
    };
  }
};

export const getGrantById = async (opportunityId: string) => {
  try {
    return await fetchWithAuth(`/explore/funding-opportunities/${opportunityId}`);
  } catch (error) {
    console.error("Error fetching grant details:", error);
    return { error: "Failed to fetch grant details" };
  }
};

export const getGovDepartmentById = async (govDepartmentId: string) => {
  try {
    return await fetchWithAuth(`/explore/gov-departments/${govDepartmentId}`);
  } catch (error) {
    console.error("Error fetching govDepartment details:", error);
    return null;
  }
};

export const getAllPublicPrograms = async () => {
  try {
    return await fetchWithAuth(`/problemStatements/public`);
  } catch (error) {
    console.error("Error fetching all public programs:", error);
    return [];
  }
};

export const getProgramByIdPublic = async (programId: string) => {
  try {
    return await fetchWithAuth(`/problemStatements/public/${programId}`);
  } catch (error) {
    console.error("Error fetching program details:", error);
    return { error: "Failed to fetch program details" };
  }
};
