import { apiRequest } from "./client";

export function loginUser(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function registerUser(credentials) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: credentials,
  });
}
