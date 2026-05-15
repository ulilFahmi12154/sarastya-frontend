import { apiRequest } from "./client";

export function getProjects() {
  return apiRequest("/api/projects");
}

export function getProjectById(projectId) {
  return apiRequest(`/api/projects/${projectId}`);
}

export function createProject(project) {
  return apiRequest("/api/projects", {
    method: "POST",
    body: project,
  });
}

export function updateProject(projectId, project) {
  return apiRequest(`/api/projects/${projectId}`, {
    method: "PUT",
    body: project,
  });
}

export function deleteProject(projectId) {
  return apiRequest(`/api/projects/${projectId}`, {
    method: "DELETE",
  });
}
