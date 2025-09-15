export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function getUserId() {
  const raw = localStorage.getItem("userId");
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function setUserId(id) {
  if (id) {
    localStorage.setItem("userId", String(id));
  } else {
    localStorage.removeItem("userId");
  }
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) clearSession();
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  return isJson ? response.json() : response.text();
}
