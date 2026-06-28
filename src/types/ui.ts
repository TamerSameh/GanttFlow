export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type ModalType = 'create-project' | 'create-task' | 'invite-team' | 'export' | 'delete-confirm';

export type SidebarVariant = 'full' | 'icons' | 'hidden';

export type Theme = 'light' | 'dark' | 'system';
