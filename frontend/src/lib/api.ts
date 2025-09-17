export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function apiFetch(path: string, token?: string, options: RequestInit = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }).then(res => res.json());
}

