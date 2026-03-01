import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';
export type ToastVariant = 'toast' | 'snackbar';

export type Toast = {
  id: string;
  message: string;
  type?: ToastType;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => string;
  remove: (id: string) => void;
  clear: () => void;
};

let toastCounter = 0;

const createToastId = () => {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
};

export const useToastStore = create<ToastState>(set => ({
  toasts: [],

  show: toast => {
    const id = createToastId();
    set(state => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },

  remove: id =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    })),

  clear: () => set({ toasts: [] }),
}));
