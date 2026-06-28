import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, changes: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

const sampleProjects: Project[] = [
  { id: '1', name: 'Website Redesign', description: 'Complete website overhaul with new design system', startDate: '2026-06-01', endDate: '2026-07-15', status: 'on-track', progress: 65, managerId: 'alex', teamIds: ['sarah', 'marcus'], createdAt: '2026-05-15', updatedAt: '2026-06-20' },
  { id: '2', name: 'Mobile App v2', description: 'Version 2 of the mobile application with new features', startDate: '2026-06-10', endDate: '2026-08-30', status: 'at-risk', progress: 40, managerId: 'sarah', teamIds: ['marcus', 'david'], createdAt: '2026-05-20', updatedAt: '2026-06-18' },
  { id: '3', name: 'Q3 Marketing Campaign', description: 'Marketing campaign for Q3 product launch', startDate: '2026-07-01', endDate: '2026-09-01', status: 'on-track', progress: 25, managerId: 'marcus', teamIds: ['priya'], createdAt: '2026-06-01', updatedAt: '2026-06-15' },
  { id: '4', name: 'API Migration', description: 'Migrate legacy APIs to new microservices architecture', startDate: '2026-05-01', endDate: '2026-06-30', status: 'behind', progress: 30, managerId: 'priya', teamIds: ['david'], createdAt: '2026-04-15', updatedAt: '2026-06-22' },
  { id: '5', name: 'Brand Guidelines', description: 'Create comprehensive brand guidelines document', startDate: '2026-05-15', endDate: '2026-06-01', status: 'completed', progress: 100, managerId: 'alex', teamIds: [], createdAt: '2026-05-01', updatedAt: '2026-06-01' },
];

const managerNames: Record<string, string> = {
  alex: 'Alex Morgan',
  sarah: 'Sarah Chen',
  marcus: 'Marcus Jones',
  priya: 'Priya Patel',
  david: 'David Kim',
};

export function getManagerName(managerId: string): string {
  return managerNames[managerId] ?? managerId;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
  projects: sampleProjects,
  activeProjectId: null,

  setProjects: (projects) => set({ projects }),
  setActiveProject: (id) => set({ activeProjectId: id }),
  addProject: (project) =>
    set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, changes) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...changes } : p,
      ),
    })),
  removeProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      activeProjectId:
        s.activeProjectId === id ? null : s.activeProjectId,
    })),
}),
    {
      name: 'ganttflow-projects',
    },
  ),
);
