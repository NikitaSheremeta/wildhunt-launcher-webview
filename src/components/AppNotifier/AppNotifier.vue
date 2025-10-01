<template>
  <transition name="slide-up" mode="out-in">
    <div
      v-if="message"
      :key="messageKey"
      class="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 h-[48px] w-[320px] max-w-[320px] px-4 py-3 rounded-[12px] shadow-lg text-white backdrop-blur-md justify-center"
      :class="[
        messageTheme === 'default' ? 'bg-gray-900/70' : '',
        messageTheme === 'success' ? 'bg-green-500/70' : '',
        messageTheme === 'error' ? 'bg-red-500/70' : '',
      ]"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <p class="text-sm whitespace-pre-line">{{ message }}</p>

        <button
          type="button"
          class="ml-auto text-white/70 hover:text-white focus:outline-none"
          aria-label="Close notification"
          @click="onClose"
        >
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useNotificationsStore } from '@/stores/notifications';
import { storeToRefs } from 'pinia';
import { onMounted, onBeforeUnmount } from 'vue';

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
