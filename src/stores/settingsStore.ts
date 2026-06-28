import { create } from 'zustand';

export interface TeamMember {
  name: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
}

interface PersistedSettings {
  workspaceName: string;
  calendar: string;
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  teamMembers: TeamMember[];
}

interface SettingsState extends PersistedSettings {
  setWorkspaceName: (name: string) => void;
  setCalendar: (calendar: string) => void;
  setWorkingDays: (days: string[]) => void;
  setWorkingHours: (start: string, end: string) => void;
  setTeamMemberRole: (name: string, role: TeamMember['role']) => void;
}

const defaultTeam: TeamMember[] = [
  { name: 'Alex Morgan (you)', role: 'admin' },
  { name: 'Sarah Chen', role: 'editor' },
  { name: 'Marcus Jones', role: 'editor' },
  { name: 'Priya Patel', role: 'editor' },
  { name: 'David Kim', role: 'editor' },
];

const STORAGE_KEY = 'ganttflow-settings';

function load(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SettingsState;
  } catch {}
  return {
    workspaceName: 'GanttFlow Team',
    calendar: 'mon-fri',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    teamMembers: defaultTeam,
  };
}

function save(state: SettingsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const useSettingsStore = create<SettingsState>((set) => {
  const initial = load();
  return {
    ...initial,
    setWorkspaceName: (workspaceName) =>
      set((s) => {
        const next = { ...s, workspaceName };
        save(next);
        return next;
      }),
    setCalendar: (calendar) =>
      set((s) => {
        const next = { ...s, calendar };
        save(next);
        return next;
      }),
    setWorkingDays: (workingDays) =>
      set((s) => {
        const next = { ...s, workingDays };
        save(next);
        return next;
      }),
    setWorkingHours: (workingHoursStart, workingHoursEnd) =>
      set((s) => {
        const next = { ...s, workingHoursStart, workingHoursEnd };
        save(next);
        return next;
      }),
    setTeamMemberRole: (name, role) =>
      set((s) => {
        const teamMembers = s.teamMembers.map((m) =>
          m.name === name ? { ...m, role } : m,
        );
        const next = { ...s, teamMembers };
        save(next);
        return next;
      }),
  };
});
