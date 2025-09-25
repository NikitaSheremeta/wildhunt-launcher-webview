<template>
  <div class="flex flex-col w-[320px] select-none">
    <h1 class="text-2xl text-white">Вход в аккаунт</h1>

    <div class="flex flex-col gap-[16px] mt-[24px]">
      <input
        id="login"
        v-model="data.login"
        type="text"
        class="px-[24px] h-[52px] rounded-[12px] bg-gray-800 text-white placeholder:text-gray-600 hover:placeholder:text-gray-700 focus:placeholder:text-gray-700 outline-none"
        placeholder="Имя игрока или электронная почта"
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
        @click="onLoginButtonClick"
      >
        Войти
      </button>
    </div>

    <span class="mt-[16px] text-sm text-gray-600 hover:text-white active:text-white cursor-pointer">
      Забыли пароль или не можете войти?
    </span>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';

const authStore = useAuthStore();

const { isLogInLoading } = storeToRefs(authStore);

const data = reactive({
  login: '',
  password: '',
});

const onLoginButtonClick = async () => {
  await authStore.logIn(data);
};
</script>
