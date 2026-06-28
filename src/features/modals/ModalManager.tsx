import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input } from '@/components/ui';
import { useUIStore, useProjectStore } from '@/stores';
import { useGanttStore } from '@/features/gantt/store';
import { Plus } from 'lucide-react';
import { createProjectSchema, createTaskSchema, inviteTeamSchema } from '@/lib/validation';

export function ModalManager() {
  const navigate = useNavigate();
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const modalData = useUIStore((s) => s.modalData) as Record<string, unknown> | null;
  const addToast = useUIStore((s) => s.addToast);

  const addProject = useProjectStore((s) => s.addProject);
  const removeProject = useProjectStore((s) => s.removeProject);
  const removeTask = useGanttStore((s) => s.removeTask);

  const [formData, setFormData] = useState<Record<string, string>>({});

  const update = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => setFormData({});

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  if (activeModal === 'create-project') {
    return (
      <Modal open onClose={handleClose} title="Create Project" size="md">
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={formData.name ?? ''}
            onChange={(e) => update('name', e.target.value)}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={formData.description ?? ''}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Brief description of the project"
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                const parsed = createProjectSchema.safeParse(formData);
                if (!parsed.success) {
                  addToast({ message: parsed.error.issues[0]?.message ?? 'Invalid input', variant: 'error' });
                  return;
                }
                const { name, description } = parsed.data;
                const project = {
                  id: `proj-${Date.now()}`,
                  name,
                  description: description ?? '',
                  status: 'on-track' as const,
                  progress: 0,
                  managerId: 'current-user',
                  teamIds: [],
                  startDate: new Date().toISOString().split('T')[0]!,
                  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                addProject(project);
                addToast({ message: `Project "${name}" created`, variant: 'success' });
                resetForm();
                closeModal();
                navigate(`/projects/${project.id}`);
              }}
            >
              <Plus className="size-4" />
              Create
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (activeModal === 'create-task') {
    return (
      <Modal open onClose={handleClose} title="Create Task" size="md">
        <div className="space-y-4">
          <Input
            label="Task Name"
            placeholder="e.g. Design homepage"
            value={formData.taskName ?? ''}
            onChange={(e) => update('taskName', e.target.value)}
          />
          <Input
            label="Assignee"
            placeholder="Team member name"
            value={formData.assignee ?? ''}
            onChange={(e) => update('assignee', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate ?? new Date().toISOString().split('T')[0]!}
              onChange={(e) => update('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!}
              onChange={(e) => update('endDate', e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                const parsed = createTaskSchema.safeParse(formData);
                if (!parsed.success) {
                  addToast({ message: parsed.error.issues[0]?.message ?? 'Invalid input', variant: 'error' });
                  return;
                }
                const { taskName, assignee, startDate, endDate } = parsed.data;
                const { addTask: addTaskAction, tasks: currentTasks } = useGanttStore.getState();
                addTaskAction({
                  id: `task-${Date.now()}`,
                  projectId: (modalData?.projectId as string) ?? '',
                  parentId: null,
                  name: taskName,
                  description: '',
                  startDate: startDate || new Date().toISOString().split('T')[0]!,
                  endDate: endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
                  duration: 14,
                  progress: 0,
                  assigneeId: assignee ? `user-${Date.now()}` : null,
                  constraint: null,
                  constraintDate: null,
                  priority: 'medium' as const,
                  status: 'not-started' as const,
                  isMilestone: false,
                  isSummary: false,
                  sortOrder: currentTasks.length,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
                addToast({ message: `Task "${taskName}" created`, variant: 'success' });
                resetForm();
                closeModal();
              }}
            >
              <Plus className="size-4" />
              Create
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (activeModal === 'delete-confirm') {
    const entityType = (modalData?.type as string) ?? (modalData?.entityType as string) ?? 'item';
    const entityName = (modalData?.name as string) ?? (modalData?.entityName as string) ?? entityType;
    const entityId = modalData?.id as string | undefined;
    return (
      <Modal open onClose={handleClose} title={`Delete ${entityType}`} size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <strong>{entityName}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (entityType === 'project' && entityId) {
                removeProject(entityId);
              } else if (entityType === 'task' && entityId) {
                removeTask(entityId);
              }
              addToast({ message: `${entityType} deleted`, variant: 'success' });
              resetForm();
              closeModal();
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    );
  }

  if (activeModal === 'invite-team') {
    return (
      <Modal open onClose={handleClose} title="Invite Team Member" size="md">
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={formData.email ?? ''}
            onChange={(e) => update('email', e.target.value)}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select
              value={formData.role ?? 'member'}
              onChange={(e) => update('role', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                const parsed = inviteTeamSchema.safeParse(formData);
                if (!parsed.success) {
                  addToast({ message: parsed.error.issues[0]?.message ?? 'Invalid input', variant: 'error' });
                  return;
                }
                addToast({ message: `Invitation sent to ${parsed.data.email}`, variant: 'success' });
                resetForm();
                closeModal();
              }}
            >
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (activeModal === 'export') {
    return (
      <Modal open onClose={handleClose} title="Export Schedule" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Choose an export format for your project schedule.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              addToast({ message: 'CSV export started', variant: 'success' });
              handleClose();
            }}
            className="rounded-lg border border-slate-200 p-4 text-center text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <div className="font-medium text-slate-700 dark:text-slate-300">CSV</div>
            <div className="mt-1 text-xs text-slate-400">Spreadsheet format</div>
          </button>
          <button
            onClick={() => {
              addToast({ message: 'PDF export coming soon', variant: 'info' });
              handleClose();
            }}
            className="rounded-lg border border-slate-200 p-4 text-center text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <div className="font-medium text-slate-700 dark:text-slate-300">PDF</div>
            <div className="mt-1 text-xs text-slate-400">Document format</div>
          </button>
        </div>
      </Modal>
    );
  }

  return null;
}