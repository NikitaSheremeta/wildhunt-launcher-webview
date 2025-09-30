<template>
  <transition name="slide-up">
    <div
      v-if="isVisible"
      class="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 max-w-[90vw] min-w-[320px] px-4 py-3 rounded-lg shadow-lg bg-neutral-900 text-white"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <div class="mt-0.5">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        </div>
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
import { storeToRefs } from 'pinia';
import { useNotificationsStore } from '@/stores/notifications';

const notificationsStore = useNotificationsStore();
const { message, isVisible } = storeToRefs(notificationsStore);

const onClose = () => notificationsStore.clear();
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(24px);
  opacity: 0;
}
</style>
