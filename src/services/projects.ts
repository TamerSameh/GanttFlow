import { apiClient } from './api';
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '@/types';

export const projectsApi = {
  list: () => apiClient.get<Project[]>('/projects'),

  get: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (data: CreateProjectDTO) =>
    apiClient.post<Project>('/projects', data),

  update: (id: string, data: UpdateProjectDTO) =>
    apiClient.put<Project>(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/projects/${id}`),
};
