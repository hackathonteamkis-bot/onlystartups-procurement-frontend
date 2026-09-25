"use server";

import { fetchWithAuth } from "@/lib/api";

export const initiateTwoFactorToggle = async () => {
  return fetchWithAuth('/auth/2fa/initiate', {
    method: 'POST',
  });
};

export const confirmTwoFactorToggle = async (code: string) => {
  return fetchWithAuth('/auth/2fa/confirm', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
};

export const deleteAccount = async () => {
  return fetchWithAuth('/users/me', {
    method: 'DELETE',
  });
};
