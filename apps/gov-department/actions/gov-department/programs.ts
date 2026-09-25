"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getPrograms = async () => {
  try {
    return await fetchWithAuth("/problemStatements");
  } catch (error: any) {
    console.error("Error fetching programs:", error);
    return { error: error.message || "Failed to fetch programs" };
  }
};

export const createProgram = async (data: any) => {
  try {
    const res = await fetchWithAuth("/problemStatements", {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath("/gov-department/programs");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error creating program:", error);
    return { error: error.message || "Failed to create program" };
  }
};

export const updateProgram = async (id: string, data: any) => {
  try {
    const res = await fetchWithAuth(`/problemStatements/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidatePath("/gov-department/programs");
    revalidatePath(`/gov-department/programs/${id}/customize`);
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error updating program:", error);
    return { error: error.message || "Failed to update program" };
  }
};

export const getProgramById = async (id: string) => {
  try {
    return await fetchWithAuth(`/problemStatements/${id}`, { cache: 'no-store' });
  } catch (error: any) {
    console.error("Error fetching program:", error);
    return { error: error.message || "Failed to fetch program" };
  }
};

export const deleteProgram = async (id: string) => {
  try {
    const res = await fetchWithAuth(`/problemStatements/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/gov-department/programs");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Error deleting program:", error);
    return { error: error.message || "Failed to delete program" };
  }
};
