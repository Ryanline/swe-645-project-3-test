// This file contains the frontend API helpers for backend CRUD requests.
// It centralizes fetch logic so the UI can stay focused on rendering and state.
import type { SurveyFormData } from "./types";

function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  if (window.location.port === "5173") {
    return "http://localhost:8000/api";
  }

  return "/api";
}

const apiBaseUrl = resolveApiBaseUrl();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function fetchSurveys(): Promise<SurveyFormData[]> {
  return request<SurveyFormData[]>("/surveys");
}

export function createSurvey(payload: SurveyFormData): Promise<SurveyFormData> {
  return request<SurveyFormData>("/surveys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSurvey(id: number, payload: SurveyFormData): Promise<SurveyFormData> {
  return request<SurveyFormData>(`/surveys/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteSurvey(id: number): Promise<void> {
  return request<void>(`/surveys/${id}`, {
    method: "DELETE",
  });
}
