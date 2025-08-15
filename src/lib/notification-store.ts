
'use client';

import { create } from 'zustand';
import type { ToastProps } from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
}

interface NotificationState {
  notifications: ToasterToast[];
  add: (notification: Omit<ToasterToast, 'id'>) => void;
  dismiss: (id: string) => void;
}

// This is a client-side store for managing UI notifications.
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (notification) => {
    const id = new Date().toISOString() + Math.random();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
  },
  dismiss: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
