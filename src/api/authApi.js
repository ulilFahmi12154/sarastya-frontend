import { apiRequest } from "./client";

export function loginUser(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
    includeAuth: false,
    skipUnauthorizedHandling: true,
    unauthorizedMessage: "Email atau password salah. Periksa kembali data login kamu.",
  });
}

export function registerUser(credentials) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: credentials,
    includeAuth: false,
    skipUnauthorizedHandling: true,
    unauthorizedMessage: "Register gagal. Periksa kembali email dan password kamu.",
  });
}
