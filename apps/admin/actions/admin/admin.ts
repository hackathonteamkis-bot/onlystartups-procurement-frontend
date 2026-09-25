"use server";

import { fetchWithAuth } from "@/lib/api";
import { UserRole } from "@/schemas";

export const getAllUsers = async () => {
  return fetchWithAuth('/admin/users');
};

export const getAdminStats = async () => {
  return fetchWithAuth('/admin/stats');
};

export const getAnalyticsGrowth = async () => {
  return fetchWithAuth('/admin/analytics/growth');
};

export const getAnalyticsEngagement = async () => {
  return fetchWithAuth('/admin/analytics/engagement');
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  return fetchWithAuth(`/admin/users/${userId}/role`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
};

export const deleteUser = async (userId: string) => {
  return fetchWithAuth(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
};

export const getUserDetails = async (userId: string) => {
  return fetchWithAuth(`/admin/users/${userId}`);
};
