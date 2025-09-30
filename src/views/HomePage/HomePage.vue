<template>
  <h1>Привет ...</h1>

  <button
    id="play-button"
    class="px-[24px] w-full h-[48px] bg-violet-500 hover:bg-violet-600 active:bg-violet-600 rounded-[12px] text-white cursor-pointer"
  >
    Играть
  </button>

  <button 
    id="log-out-button"
    class="px-[24px] mt-[24px] w-full h-[48px] bg-violet-500 hover:bg-violet-600 active:bg-violet-600 rounded-[12px] text-white cursor-pointer"
    @click="onLogOutButtonClick"
  >
    Выйти
  </button>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const onLogOutButtonClick = async () => {
  await authStore.logOut();
};
</script>