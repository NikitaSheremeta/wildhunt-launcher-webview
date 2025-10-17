<template>
  <form class="flex flex-col mt-40 w-80 select-none" @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Регистрация аккаунта</h1>

    <div class="flex flex-col gap-4 mt-6">
      <AppInput
        id="login"
        name="login"
        type="text"
        placeholder="Логин или электронная почта"
        autofocus
        v-model="data.username"
      />
    </div>

    <div class="mt-6">
      <AppButton id="login-button" type="submit" theme="primary" label="Войти" />
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

import AppInput from '@/components/AppInput/AppInput.vue';
import AppButton from '@/components/AppButton/AppButton.vue';

const data = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});
</script>
