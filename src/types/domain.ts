export type ProjectStatus = 'on-track' | 'at-risk' | 'behind' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
  managerId: string;
  teamIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskConstraint =
  | 'ASAP'
  | 'ALAP'
  | 'FNET'
  | 'SNET'
  | 'FNLT'
  | 'MFO';

export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF';

export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  assigneeId: string | null;
  constraint: TaskConstraint | null;
  constraintDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  isMilestone: boolean;
  isSummary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Dependency {
  id: string;
  projectId: string;
  predecessorId: string;
  successorId: string;
  type: DependencyType;
  lag: number;
}

export interface Resource {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  capacity: number;
  skills: string[];
  costRate: number;
}

export interface Assignment {
  id: string;
  taskId: string;
  resourceId: string;
  plannedHours: number;
  actualHours: number;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tasks: TemplateTask[];
  usageCount: number;
}

export interface TemplateTask {
  name: string;
  duration: number;
  dependencyOrder: number;
}
