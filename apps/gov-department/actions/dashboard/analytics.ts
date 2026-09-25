"use server";

import { fetchWithAuth } from "@/lib/api";

export const trackAnalytics = async (type: string, key: string, govDepartmentId?: string, metadata?: Record<string, unknown>) => {
    return fetchWithAuth('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ type, key, govDepartmentId, metadata }),
    });
};

export const getAnalytics = async (govDepartmentId: string) => {
    return fetchWithAuth(`/analytics/gov-department/${govDepartmentId}`);
};

export const getEventsAnalytics = async (govDepartmentId: string) => {
    return fetchWithAuth(`/analytics/gov-department/${govDepartmentId}/events`);
}

export const getDailyAnalytics = async (govDepartmentId: string, days = 7) => {
    return fetchWithAuth(`/analytics/gov-department/${govDepartmentId}/daily?days=${days}`);
};
