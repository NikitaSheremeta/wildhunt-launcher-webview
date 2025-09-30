import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationsStore = defineStore('notifications', () => {
  const message = ref(null);
  const isVisible = ref(false);

  let hideTimerId = null;

  const clearHideTimerIfExists = () => {
    if (hideTimerId) {
      clearTimeout(hideTimerId);
      hideTimerId = null;
    }
  };

  const clear = () => {
    message.value = null;
    isVisible.value = false;
    clearHideTimerIfExists();
  };

  const show = (text, durationMs = 30000) => {
    clearHideTimerIfExists();

    message.value = text == null ? '' : String(text);
    isVisible.value = true;

    if (durationMs > 0) {
      hideTimerId = setTimeout(() => {
        clear();
      }, durationMs);
    }
  };

  return {
    message,
    isVisible,
    show,
    clear,
  };
});
