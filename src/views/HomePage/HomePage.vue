<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <AppButton theme="primary" label="Играть" :loading="isPlayLoading" @click="onPlayClick" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useNotificationsStore } from '@/stores/notifications';
import { ALLOWED_THEMES } from '@/constants/themes';
import { request as launcherRequest } from '@/bridge/launcher-bridge';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const { playerLogin } = storeToRefs(authStore);

const isPlayLoading = ref(false);

const onPlayClick = async () => {
  try {
    isPlayLoading.value = true;
    const response = await launcherRequest('game.play', { login: playerLogin.value || '' });

    if (response.status >= 200 && response.status < 300) {
      // Launcher is starting the client asynchronously.
      notificationsStore.show('Запускаю клиент...', ALLOWED_THEMES.SUCCESS, 2500);
    } else {
      notificationsStore.show(response.data?.message || 'Не удалось запустить клиент', ALLOWED_THEMES.ERROR);
    }
  } catch (e) {
    notificationsStore.show('Не удалось запустить клиент (ошибка bridge)', ALLOWED_THEMES.ERROR);
  } finally {
    isPlayLoading.value = false;
  }
};
</script>
