import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
});

export const createTaskSchema = z.object({
  taskName: z.string().min(1, 'Task name is required'),
  assignee: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const inviteTeamSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['member', 'admin', 'viewer']),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type InviteTeamInput = z.infer<typeof inviteTeamSchema>;
