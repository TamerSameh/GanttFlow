import { apiClient } from './api';
import type { Resource, Assignment, CreateResourceDTO } from '@/types';

export const resourcesApi = {
  list: () => apiClient.get<Resource[]>('/resources'),

  get: (id: string) => apiClient.get<Resource>(`/resources/${id}`),

  create: (data: CreateResourceDTO) =>
    apiClient.post<Resource>('/resources', data),

  update: (id: string, data: Partial<CreateResourceDTO>) =>
    apiClient.put<Resource>(`/resources/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/resources/${id}`),

  assignments: {
    list: (resourceId: string) =>
      apiClient.get<Assignment[]>(`/resources/${resourceId}/assignments`),

    create: (data: { taskId: string; resourceId: string; plannedHours: number }) =>
      apiClient.post<Assignment>('/assignments', data),

    update: (assignmentId: string, data: Partial<Assignment>) =>
      apiClient.put<Assignment>(`/assignments/${assignmentId}`, data),

    delete: (assignmentId: string) =>
      apiClient.delete<void>(`/assignments/${assignmentId}`),
  },
};
