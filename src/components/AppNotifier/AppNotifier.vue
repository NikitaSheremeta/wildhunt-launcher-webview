<template>
  <transition name="slide-up" mode="out-in">
    <div
      v-if="message"
      :key="messageKey"
      class="z-50 fixed flex items-center gap-4 left-1/2 -translate-x-1/2 bottom-6 h-14 w-80 max-w-80 px-6 rounded-full shadow-lg text-white backdrop-blur-md"
      :class="[
        messageTheme === 'default' ? 'bg-gray-900/70' : '',
        messageTheme === 'success' ? 'bg-green-700' : '',
        messageTheme === 'error' ? 'bg-orange-700' : '',
      ]"
      :style="notificationStyle"
      role="status"
      aria-live="polite"
    >
      <p class="text-sm whitespace-pre-line" v-text="message" />

      <button
        type="button"
        class="ml-auto opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none transition duration-200 cursor-pointer"
        aria-label="Close notification"
        @click="onClose"
      >
        <AppIcon icon="cross" color="white" width="12" height="12" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { useNotificationsStore } from '@/stores/notifications';
import { storeToRefs } from 'pinia';
import { onMounted, onBeforeUnmount, computed } from 'vue';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

const notificationsStore = useNotificationsStore();

const { message, messageTheme, messageKey } = storeToRefs(notificationsStore);

const themeShadowColors = {
  default: 'rgba(17, 24, 39, 0.3)',
  success: 'rgba(34, 197, 94, 0.3)',
  error: 'rgba(194, 65, 12, 0.3)',
};

const notificationStyle = computed(() => {
  return {
    boxShadow: `0px 8px 24px ${themeShadowColors[messageTheme.value]}`,
  };
});

const onClose = () => notificationsStore.clear();

const onKeydown = (event) => {
  if (event.key === 'Escape' && message.value) {
    notificationsStore.clear();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>
