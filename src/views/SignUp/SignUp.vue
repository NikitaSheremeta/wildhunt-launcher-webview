<template>
  <form class="flex flex-col mt-40 w-80 select-none" @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Регистрация аккаунта</h1>

    <div class="flex flex-col gap-4 mt-6">
      <AppInput id="username" name="username" type="text" placeholder="Логин" v-model="data.username" />

      <AppInput id="email" name="email" type="text" placeholder="Электронная почта" v-model="data.email" />

      <AppPassword v-model="data.password" create placeholder="Пароль" />

      <AppPassword v-model="data.passwordConfirmation" placeholder="Подтверждение пароля" />

      <AppCheckbox v-model="flags.eula" label="Я принимаю">
        <AppLink href="terms" color="secondary" label="пользовательское соглашение" small underline />

        <br />и

        <AppLink href="privacy-policy" color="secondary" label="политику конфиденциальности" small underline />
      </AppCheckbox>
    </div>

    <div class="mt-6">
      <AppButton :disabled="!flags.eula" type="submit" theme="primary" label="Зарегистрироваться" />
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

import AppInput from '@/components/AppInput/AppInput.vue';
import AppPassword from '@/components/AppPassword/AppPassword.vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppCheckbox from '@/components/AppCheckbox/AppCheckbox.vue';
import AppLink from '@/components/AppLink/AppLink.vue';

const data = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const flags = reactive({
  eula: true,
});
</script>
