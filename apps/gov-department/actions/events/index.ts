"use server";

import { fetchWithAuth } from "@/lib/api";

export const getEvents = async () => {
  return fetchWithAuth('/events');
};

export const createMeetup = async (data: Record<string, unknown>) => {
  return fetchWithAuth('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const registerForEvent = async (eventId: string) => {
  return fetchWithAuth(`/events/${eventId}/register`, {
    method: 'POST',
  });
};

export const getGovDepartmentEventRegistrations = async () => {
  return fetchWithAuth('/events/gov-department/registrations');
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

export const getEventById = async (eventId: string) => {
  return fetchWithAuth(`/events/${eventId}`);
};
