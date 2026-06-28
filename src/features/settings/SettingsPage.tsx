import { Tabs, Button, Input, Select } from '@/components/ui';
import { useUIStore } from '@/stores';
import { useSettingsStore } from '@/stores/settingsStore';

export default function SettingsPage() {
  const addToast = useUIStore((s) => s.addToast);
  const openModal = useUIStore((s) => s.openModal);
  const {
    workspaceName,
    calendar,
    workingDays,
    workingHoursStart,
    workingHoursEnd,
    teamMembers,
    setWorkspaceName,
    setCalendar,
    setWorkingDays,
    setWorkingHours,
    setTeamMemberRole,
  } = useSettingsStore();

  const settingsTabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div className="space-y-6 max-w-lg">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Workspace Name</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Your team's workspace identifier.</p>
            <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Default Calendar</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Set your organization's default working days and hours.</p>
            <Select
              options={[
                { value: 'mon-fri', label: 'Monday - Friday (9:00 - 18:00)' },
                { value: 'mon-sat', label: 'Monday - Saturday (9:00 - 17:00)' },
                { value: 'custom', label: 'Custom Schedule' },
              ]}
              value={calendar}
              onChange={(e) => setCalendar(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <Button onClick={() => addToast({ message: 'Workspace settings saved', variant: 'success' })}>Save Changes</Button>
          </div>
        </div>
      ),
    },
    {
      id: 'team',
      label: 'Team',
      content: (
        <div className="space-y-6 max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Team Members</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage who has access to this workspace.</p>
            </div>
            <Button size="sm" onClick={() => openModal('invite-team')}>Invite</Button>
          </div>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{member.name}</span>
                <Select
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'viewer', label: 'Viewer' },
                  ]}
                  value={member.role}
                  onChange={(e) => setTeamMemberRole(member.name, e.target.value as typeof member.role)}
                  className="w-32"
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'calendar',
      label: 'Calendar',
      content: (
        <div className="space-y-6 max-w-lg">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Working Days</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Select which days are working days.</p>
            <div className="flex gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <label
                  key={day}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-150 has-checked:bg-primary-100 has-checked:border-primary-400 has-checked:shadow-sm dark:border-slate-600 dark:has-checked:bg-primary-900/70"
                >
                  <input
                    type="checkbox"
                    checked={workingDays.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWorkingDays([...workingDays, day]);
                      } else {
                        setWorkingDays(workingDays.filter((d) => d !== day));
                      }
                    }}
                    className="sr-only"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Working Hours</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Set daily working hours.</p>
            <div className="flex items-center gap-3">
              <Input type="time" value={workingHoursStart} onChange={(e) => setWorkingHours(e.target.value, workingHoursEnd)} className="w-32" label="Start" />
              <span className="text-slate-400 mt-6">to</span>
              <Input type="time" value={workingHoursEnd} onChange={(e) => setWorkingHours(workingHoursStart, e.target.value)} className="w-32" label="End" />
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={() => addToast({ message: 'Calendar settings saved', variant: 'success' })}>Save Calendar</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your workspace settings and preferences.
        </p>
      </div>
      <Tabs tabs={settingsTabs} />
    </div>
  );
}
