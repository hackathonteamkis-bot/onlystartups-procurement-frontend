"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getHubMentors = async () => {
  return fetchWithAuth('/mentors/hub');
};

export const getMentorsDirectory = async () => {
  return fetchWithAuth('/mentors/directory');
};

export const getHubMentorById = async (id: string) => {
  return fetchWithAuth(`/mentors/hub/${id}`);
};

export const addMentor = async (data: { name: string; email: string; expertise: string[] }) => {
  const result = await fetchWithAuth('/mentors/hub/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log("ADD MENTOR RESULT FROM API:", result);
  revalidatePath('/gov-department/mentors');
  return result;
};

export const getHubMentorAnalytics = async () => {
  return fetchWithAuth('/mentors/hub/analytics');
};

export const getMyMentorProfile = async () => {
  return fetchWithAuth('/mentors/profile');
};

export const updateAvailability = async (data: { availability: any; meetLink?: string }) => {
  const result = await fetchWithAuth('/mentors/availability', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  revalidatePath('/mentor/availability');
  return result;
};

export const scheduleSession = async (data: { mentorProfileId: string; date: string; time: string; meetLink?: string }) => {
  // Pass the startupId in the controller, so we just pass the rest here.
  const result = await fetchWithAuth('/gov-department/mentor-sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  revalidatePath('/mentors');
  return result;
};
