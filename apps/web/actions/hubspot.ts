'use server';

import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export const getHubSpotData = async () => {
  try {
    return await fetchWithAuth('/hubspot');
  } catch (error: any) {
    return { error: error.message || 'An error occurred' };
  }
};

export const createHubSpotPost = async (content: string) => {
  const result = await fetchWithAuth('/hubspot/post', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  revalidatePath('/hubspot');
  return result;
};

export const createHubSpotComment = async (postId: string, content: string) => {
  const result = await fetchWithAuth(`/hubspot/post/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  revalidatePath('/hubspot');
  return result;
};

export const createHubSpotTask = async (assigneeId: string, title: string, description: string) => {
  const result = await fetchWithAuth('/hubspot/task', {
    method: 'POST',
    body: JSON.stringify({ assigneeId, title, description }),
  });
  revalidatePath('/hubspot');
  return result;
};

export const updateHubSpotTaskStatus = async (taskId: string, status: string) => {
  const result = await fetchWithAuth(`/hubspot/task/${taskId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
  revalidatePath('/hubspot');
  return result;
};

export const createHubSpotResource = async (title: string, url: string, description: string) => {
  const result = await fetchWithAuth('/hubspot/resource', {
    method: 'POST',
    body: JSON.stringify({ title, url, description }),
  });
  revalidatePath('/hubspot');
  return result;
};

export const createHubSpotDocument = async (category: string, title: string, url: string, fileType: string) => {
  const result = await fetchWithAuth('/hubspot/document', {
    method: 'POST',
    body: JSON.stringify({ category, title, url, fileType }),
  });
  revalidatePath('/hubspot');
  return result;
};

export const deleteHubSpotDocument = async (documentId: string) => {
  const result = await fetchWithAuth(`/hubspot/document/${documentId}`, {
    method: 'DELETE',
  });
  revalidatePath('/hubspot');
  return result;
};
