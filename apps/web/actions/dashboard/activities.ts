"use server";

import { fetchWithAuth } from "@/lib/api";

export const getActivities = async () => {
  return fetchWithAuth('/activities');
};

export const createActivity = async (
  message: string,
  type: string = "system",
) => {
  return fetchWithAuth('/activities', {
    method: 'POST',
    body: JSON.stringify({ message, type }),
  });
};

export const ensureWelcomeActivity = async () => {
  return fetchWithAuth('/activities/ensure-welcome', {
    method: 'POST',
  });
};
