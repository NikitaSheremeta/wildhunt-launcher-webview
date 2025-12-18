<template>
  <header
    class="w-full py-4 flex items-center justify-between bg-gradient-to-b from-[var(--color-gray-900)] to-[rgba(255,255,255,0)]"
  >
    <img class="w-[6.25rem] select-none" :src="logoImage" alt="Minecraft WildHunt" decoding="async" loading="lazy" />

    <ul v-if="!isAuthenticated" class="flex gap-6">
      <li v-for="link in NAVIGATION_LINKS" :key="link.path">
        <span
          class="flex items-center gap-2 text-gray-600 cursor-pointer select-none"
          :class="{ 'text-white': route.path === link.path }"
          @click="router.push(link.path)"
        >
          {{ link.label }}

          <span class="w-1.5 h-1.5 rounded-full" :class="{ 'bg-green-500': route.path === link.path }" />
        </span>
      </li>
    </ul>

    <button
      v-if="isAuthenticated"
      id="log-out-button"
      type="button"
      class="px-6 h-12 bg-gray-800 hover:bg-gray-900 active:bg-gray-900 rounded-3xl text-white cursor-pointer"
      @click="onLogOutButtonClick"
      aria-label="Выйти из аккаунта"
    >
      Выйти
    </button>
  </header>
</template>

<script setup>
import logoImage from '@/assets/img/logo.svg';

import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';

const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);

const NAVIGATION_LINKS = [
  {
    label: 'Вход в аккаунт',
    path: '/login',
  },
  {
    label: 'Регистрация аккаунта',
    path: '/signup',
  },
];

const route = useRoute();
const router = useRouter();

const onLogOutButtonClick = debounce(async () => {
  const response = await authStore.logOut();

  if (response.status === HTTP_STATUS.OK) {
    router.push('/');
  }
});
</script>
