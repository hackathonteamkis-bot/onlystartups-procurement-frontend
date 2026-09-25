"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getHubEvents = async () => {
  try {
    return await fetchWithAuth("/events/gov-department/registrations", { cache: 'no-store' });
  } catch (error: any) {
    console.error("Error fetching hub events:", error);
    return { error: error.message || "Failed to fetch hub events" };
  }
};

export const createEvent = async (data: any) => {
  try {
    const res = await fetchWithAuth("/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath("/gov-department/events");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { error: error.message || "Failed to create event" };
  }
};

export const updateEvent = async (id: string, data: any) => {
  try {
    const res = await fetchWithAuth(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidatePath("/gov-department/events");
    revalidatePath(`/gov-department/events/${id}`);
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { error: error.message || "Failed to update event" };
  }
};

export const getEventById = async (id: string) => {
  try {
    return await fetchWithAuth(`/events/${id}`, { cache: 'no-store' });
  } catch (error: any) {
    console.error("Error fetching event:", error);
    return { error: error.message || "Failed to fetch event" };
  }
};

export const updateEventRegistrationStatus = async (regId: string, status: string) => {
  try {
    const res = await fetchWithAuth(`/events/registrations/${regId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    revalidatePath("/gov-department/events");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error updating registration status:", error);
    return { error: error.message || "Failed to update registration status" };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const res = await fetchWithAuth(`/events/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/gov-department/events");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { error: error.message || "Failed to delete event" };
  }
};
