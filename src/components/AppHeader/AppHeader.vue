<template>
  <header
    class="w-full py-[16px] flex items-center justify-between bg-gradient-to-b from-[var(--color-gray-900)] to-[rgba(255,255,255,0)]"
  >
    <img class="w-[100px]" :src="logoImage" alt="Minecraft WildHunt" />

    <ul class="flex gap-[32px]">
      <li v-for="link in NAVIGATION_LINKS" :key="link.path">
        <span
          class="text-gray-600 cursor-pointer"
          :class="{ 'text-white': route.path === link.path }"
          v-text="link.label"
          @click="router.push(link.path)"
        />
      </li>
    </ul>
  </header>
</template>

<script setup>
import logoImage from '@/assets/img/logo.svg';

import { useRoute, useRouter } from 'vue-router';

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
</script>
