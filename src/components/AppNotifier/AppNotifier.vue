<template>
  <transition name="slide-up" mode="out-in">
    <div
      v-if="message"
      :key="messageKey"
      class="z-50 fixed flex items-center gap-4 left-1/2 -translate-x-1/2 bottom-[24px] h-[48px] w-[320px] max-w-[320px] px-[24px] rounded-full shadow-lg text-white backdrop-blur-md"
      :class="[
        messageTheme === 'default' ? 'bg-gray-900/70' : '',
        messageTheme === 'success' ? 'bg-green-500/70' : '',
        messageTheme === 'error' ? 'bg-red-500/70' : '',
      ]"
      role="status"
      aria-live="polite"
    >
      <p class="text-sm whitespace-pre-line" v-text="message" />

      <button
        type="button"
        class="ml-auto text-white/70 hover:text-white focus:outline-none"
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
import { onMounted, onBeforeUnmount } from 'vue';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

const notificationsStore = useNotificationsStore();

const { message, messageTheme, messageKey } = storeToRefs(notificationsStore);

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
