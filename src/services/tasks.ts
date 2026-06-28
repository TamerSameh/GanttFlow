import { apiClient } from './api';
import type {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ReorderDTO,
  Dependency,
  CreateDependencyDTO,
} from '@/types';

export const tasksApi = {
  list: (projectId: string) =>
    apiClient.get<Task[]>(`/projects/${projectId}/tasks`),

  get: (taskId: string) => apiClient.get<Task>(`/tasks/${taskId}`),

  create: (projectId: string, data: CreateTaskDTO) =>
    apiClient.post<Task>(`/projects/${projectId}/tasks`, data),

  update: (taskId: string, data: UpdateTaskDTO) =>
    apiClient.put<Task>(`/tasks/${taskId}`, data),

  delete: (taskId: string) => apiClient.delete<void>(`/tasks/${taskId}`),

  reorder: (projectId: string, data: ReorderDTO) =>
    apiClient.put<void>(`/projects/${projectId}/tasks/reorder`, data),

  dependencies: {
    list: (projectId: string) =>
      apiClient.get<Dependency[]>(`/projects/${projectId}/dependencies`),

    create: (data: CreateDependencyDTO) =>
      apiClient.post<Dependency>('/dependencies', data),

    delete: (dependencyId: string) =>
      apiClient.delete<void>(`/dependencies/${dependencyId}`),
  },
};
