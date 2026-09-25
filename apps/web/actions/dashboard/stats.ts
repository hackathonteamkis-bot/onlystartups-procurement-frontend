"use server";

import { fetchWithAuth } from "@/lib/api";

export const getDashboardStats = async () => {
  try {
    return await fetchWithAuth('/dashboard/stats');
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      matchCount: 0,
      agreementCount: 0,
      ecosystemCount: 0,
      meetupCount: 0
    };
  }
};

export const createTestMatch = async () => {
  try {
    return await fetchWithAuth('/dashboard/test-match', { method: 'POST' });
  } catch (error) {
    console.error("Error creating test match:", error);
  }
};

export const createTestAgreement = async () => {
  try {
    return await fetchWithAuth('/dashboard/test-agreement', { method: 'POST' });
  } catch (error) {
    console.error("Error creating test agreement:", error);
  }
};
