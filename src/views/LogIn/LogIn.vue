<template>
  <form class="flex flex-col w-[320px] select-none" @submit.prevent="onLoginButtonClick">
    <h1 class="text-2xl text-white">Вход в аккаунт</h1>

    <div class="flex flex-col gap-[16px] mt-[24px]">
      <input
        id="login"
        v-model="data.login"
        type="text"
        class="px-[24px] h-[52px] rounded-[12px] bg-gray-800 text-white placeholder:text-gray-600 hover:placeholder:text-gray-700 focus:placeholder:text-gray-700 outline-none"
        placeholder="Имя игрока / электронная почта"
      />

      <input
        id="password"
        v-model="data.password"
        type="password"
        class="px-[24px] h-[52px] rounded-[12px] bg-gray-800 text-white placeholder:text-gray-600 hover:placeholder:text-gray-700 focus:placeholder:text-gray-700 outline-none"
        placeholder="Пароль"
      />
    </div>

    <div class="mt-[24px]">
      <button
        id="login-button"
        class="px-[24px] w-full h-[48px] bg-violet-500 hover:bg-violet-600 active:bg-violet-600 rounded-[12px] text-white cursor-pointer"
        type="submit"
      >
        Войти
      </button>
    </div>

    <span class="mt-[16px] text-sm text-gray-600 hover:text-white active:text-white cursor-pointer">
      Забыли пароль или не можете войти?
    </span>
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const data = reactive({
  login: '',
  password: '',
});

const onLoginButtonClick = async () => {
  const response = await authStore.logIn(data);

  if (response.status === 200) {
    authStore.setIsAuthenticated(true);

    router.push('/');
  }
};
</script>
