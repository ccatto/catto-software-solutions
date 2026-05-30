// apps/frontend/zustand/useToastStore.ts
// Minimal toast store consumed by ToastContainerCatto. Apps can extend.
import { create } from 'zustand';
import type { ToastCattoProps } from '@ccatto/ui';

export type ToastPlacement =
  | 'upperRight'
  | 'upperLeft'
  | 'lowerRight'
  | 'lowerLeft'
  | 'center';

export interface ToastItem {
  id: string;
  header?: ToastCattoProps['header'];
  body?: ToastCattoProps['body'];
  variant?: ToastCattoProps['variant'];
  duration?: ToastCattoProps['duration'];
  placement?: ToastPlacement;
}

interface ToastState {
  toasts: ToastItem[];
  maxVisible: number;
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  maxVisible: 3,
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));
