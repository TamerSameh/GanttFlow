export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamIds: string[];
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  progress?: number;
}

export interface CreateTaskDTO {
  projectId: string;
  parentId?: string | null;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  assigneeId?: string | null;
  isMilestone?: boolean;
  sortOrder?: number;
}

export interface UpdateTaskDTO {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  assigneeId?: string | null;
  status?: string;
  sortOrder?: number;
}

export interface CreateDependencyDTO {
  projectId: string;
  predecessorId: string;
  successorId: string;
  type: 'FS' | 'SS' | 'FF' | 'SF';
  lag?: number;
}

export interface CreateResourceDTO {
  name: string;
  email: string;
  role: string;
  capacity: number;
  skills: string[];
  costRate: number;
}

export interface ReorderDTO {
  taskId: string;
  newSortOrder: number;
  newParentId: string | null;
}
