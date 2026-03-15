import { create } from 'zustand';
import { Notification } from '../../types';

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  clearNotifications: () => set({ notifications: [] }),
  addNotification: (message, type = 'success') => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 3000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
}));
