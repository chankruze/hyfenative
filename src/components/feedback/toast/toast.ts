import { useToastStore } from './toast-store';

type ToastOptions = {
  duration?: number;
};

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    useToastStore.getState().show({
      message,
      type: 'success',
      variant: 'toast',
      duration: options?.duration,
    }),

  error: (message: string, options?: ToastOptions) =>
    useToastStore.getState().show({
      message,
      type: 'error',
      variant: 'toast',
      duration: options?.duration,
    }),

  info: (message: string, options?: ToastOptions) =>
    useToastStore.getState().show({
      message,
      type: 'info',
      variant: 'toast',
      duration: options?.duration,
    }),

  snackbar: (message: string, actionLabel: string, onAction: () => void) =>
    useToastStore.getState().show({
      message,
      type: 'info',
      variant: 'snackbar',
      actionLabel,
      onAction,
      duration: 5000,
    }),

  dismiss: (id: string) => useToastStore.getState().remove(id),
  clear: () => useToastStore.getState().clear(),
};
