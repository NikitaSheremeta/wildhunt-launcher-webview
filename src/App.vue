<template>
  <AppHeader class="fixed px-6 top-0 left-0 min-w-[36.25rem]" />

  <div class="flex justify-center w-screen h-screen min-w-[36.25rem]">
    <router-view />
  </div>

  <!-- Launch progress bar (driven by Java bridge events launcher.progress) -->
  <div
    v-if="launchProgress.active"
    class="fixed bottom-0 left-0 right-0 h-8 bg-neutral-800 flex flex-col justify-center z-50"
  >
    <div
      class="absolute inset-0 bg-violet-600 transition-all duration-200"
      :style="{ width: launchProgress.percent + '%' }"
    />
    <span class="relative z-10 text-white text-sm font-medium text-center">
      {{ launchProgress.percent }}% — {{ launchProgress.message || 'Загрузка...' }}
    </span>
  </div>

  <AppNotifier />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppNotifier from '@/components/AppNotifier/AppNotifier.vue';
import { onEvent } from '@/bridge/launcher-bridge';

const launchProgress = ref({
  active: false,
  progress: 0,
  percent: 0,
  message: '',
});

let unsubscribe;
onMounted(() => {
  unsubscribe = onEvent('launcher.progress', (data) => {
    if (!data) return;
    launchProgress.value = {
      active: Boolean(data.active),
      progress: Number(data.progress) || 0,
      percent: Number(data.percent) ?? Math.round((Number(data.progress) || 0) * 100),
      message: typeof data.message === 'string' ? data.message : '',
    };
  });
});
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
