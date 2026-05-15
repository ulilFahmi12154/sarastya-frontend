import { apiRequest } from "./client";

export function getTasks() {
  return apiRequest("/api/tasks");
}

export function createTask(task) {
  return apiRequest("/api/tasks", {
    method: "POST",
    body: task,
  });
}

export function updateTask(taskId, task) {
  return apiRequest(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: task,
  });
}

export function deleteTask(taskId) {
  return apiRequest(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}
