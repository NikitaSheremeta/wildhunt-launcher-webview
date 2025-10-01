import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ALLOWED_THEMES, DEFAULT_THEME } from '@/constants/themes';
import { randomHash } from '@/utils/random-hash';

const DELAY_MS = 5000;
const MESSAGE_KEY_LENGTH = 10;

export const useNotificationsStore = defineStore('notifications', () => {
  const message = ref(null);
  const messageTheme = ref(null);
  const messageKey = ref(0);

  let timer = null;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);

      timer = null;
    }
  };

  const show = (text, theme = DEFAULT_THEME, duration = DELAY_MS) => {
    clearTimer();

    message.value = text == null ? '' : String(text);
    messageTheme.value = Object.values(ALLOWED_THEMES).includes(theme) ? theme : DEFAULT_THEME;
    messageKey.value = randomHash(MESSAGE_KEY_LENGTH);

    timer = setTimeout(() => {
      clear();
    }, duration);
  };

  const clear = () => {
    message.value = null;
    messageTheme.value = null;
    messageKey.value = randomHash(MESSAGE_KEY_LENGTH);

    clearTimer();
  };

  return {
    message,
    messageTheme,
    messageKey,
    show,
    clear,
  };
});
