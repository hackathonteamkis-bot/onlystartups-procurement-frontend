"use server";

import { fetchWithAuth } from "@/lib/api";

export const getMeetups = async () => {
  return fetchWithAuth('/events');
};

export const createMeetup = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const registerForMeetup = async (meetupId: string) => {
  return fetchWithAuth(`/events/${meetupId}/register`, {
    method: 'POST',
  });
};

export const getStartupHubMeetupRegistrations = async () => {
  return fetchWithAuth('/events/startup-hub/registrations');
};

export const updateMeetupRegistrationStatus = async (
  regId: string,
  status: "APPROVED" | "REJECTED",
) => {
  return fetchWithAuth(`/events/registrations/${regId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getMeetupById = async (meetupId: string) => {
  return fetchWithAuth(`/events/${meetupId}`);
};
