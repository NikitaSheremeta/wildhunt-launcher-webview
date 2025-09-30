import { useNotificationsStore } from '@/stores/notifications';

export const notify = (text, durationMs) => {
  const store = useNotificationsStore();
  store.show(text, durationMs);
};

export const clearNotification = () => {
  const store = useNotificationsStore();
  store.clear();
};
