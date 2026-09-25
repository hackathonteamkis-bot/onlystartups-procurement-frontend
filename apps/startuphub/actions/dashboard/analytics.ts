"use server";

import { fetchWithAuth } from "@/lib/api";

export const trackAnalytics = async (type: string, key: string, startupHubId?: string, metadata?: Record<string, unknown>) => {
    return fetchWithAuth('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ type, key, startupHubId, metadata }),
    });
};

export const getAnalytics = async (startupHubId: string) => {
    return fetchWithAuth(`/analytics/startup-hub/${startupHubId}`);
};

export const getEventsAnalytics = async (startupHubId: string) => {
    return fetchWithAuth(`/analytics/startup-hub/${startupHubId}/events`);
}

export const getDailyAnalytics = async (startupHubId: string, days = 7) => {
    return fetchWithAuth(`/analytics/startup-hub/${startupHubId}/daily?days=${days}`);
};
