<template>
  <h1>Привет ...</h1>

  <div class="flex flex-col gap-[24px]">
    <button
      id="play-button"
      class="px-[24px] w-full h-[48px] bg-violet-500 hover:bg-violet-600 active:bg-violet-600 rounded-[12px] text-white cursor-pointer"
    >
      Играть
    </button>

    <button
      id="log-out-button"
      class="px-[24px] w-full h-[48px] bg-violet-500 hover:bg-violet-600 active:bg-violet-600 rounded-[12px] text-white cursor-pointer"
      @click="onLogOutButtonClick"
    >
      Выйти
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const onLogOutButtonClick = async () => {
  const response = await authStore.logOut();

  if (response.status === 200) {
    router.push('/login');
  }
};
</script>
