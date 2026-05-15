const CONFIGURED_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sarastya-backend-production.up.railway.app";

export const API_BASE_URL = import.meta.env.DEV ? "" : CONFIGURED_API_BASE_URL;

export const TOKEN_STORAGE_KEY = "taskflow_token";
export const USER_STORAGE_KEY = "taskflow_user";
const SESSION_EXPIRED_MESSAGE = "Sesi kamu sudah berakhir. Silakan login kembali.";

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function readErrorMessage(status, payload, fallbackMessage) {
  if (status === 401) {
    return fallbackMessage || SESSION_EXPIRED_MESSAGE;
  }

  if (status === 404) {
    return "Data yang kamu cari tidak ditemukan.";
  }

  if (status >= 500) {
    return "Terjadi kesalahan pada server. Coba lagi beberapa saat lagi.";
  }

  if (payload && typeof payload === "object" && typeof payload.message === "string") {
    return payload.message;
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return "Permintaan tidak dapat diproses. Periksa kembali data yang kamu masukkan.";
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    token,
    includeAuth = true,
    skipUnauthorizedHandling = false,
    unauthorizedMessage,
  } = options;
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const activeToken = includeAuth ? token ?? getStoredToken() : null;

  if (activeToken) {
    requestHeaders.Authorization = `Bearer ${activeToken}`;
  }

  const requestOptions = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Periksa koneksi, konfigurasi API, atau izin CORS backend."
    );
  }

  let payload = null;

  try {
    payload = await parseResponse(response);
  } catch {
    payload = null;
  }

  if (response.status === 401) {
    if (!skipUnauthorizedHandling) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }

    throw new Error(readErrorMessage(response.status, payload, unauthorizedMessage));
  }

  if (!response.ok || (payload && typeof payload === "object" && payload.success === false)) {
    throw new Error(readErrorMessage(response.status, payload));
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}
