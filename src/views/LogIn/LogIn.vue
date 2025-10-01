<template>
  <form class="flex flex-col w-[320px] select-none" @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-[8px]">
      <AppIcon icon="login" />

      Вход в аккаунт
    </h1>

    <div class="flex flex-col gap-[16px] mt-[24px]">
      <input
        id="login"
        v-model="data.login"
        @blur="fieldsValidation.login.blur"
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
import { ref, reactive } from 'vue';
import { required, maxLength, minLength, allowedCharacters } from '@/utils/validators';
import { VALIDATION_MESSAGES } from '@/constants/validation-messages';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';
import { useFieldsValidation } from '@/hooks/useFieldsValidation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

const authStore = useAuthStore();
const router = useRouter();

const data = reactive({
  login: '',
  password: '',
});

const rules = ref({
  login: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    maxLength: maxLength(
      VALIDATION_CONSTRAINTS.LOGIN_OR_EMAIL.MAX_LENGTH,
      VALIDATION_MESSAGES.LOGIN_OR_EMAIL.MAX_LENGTH,
    ),
  },
  password: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    minLength: minLength(VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH),
    maxLength: maxLength(VALIDATION_CONSTRAINTS.PASSWORD.MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD.MAX_LENGTH),
    allowedCharacters: allowedCharacters(VALIDATION_MESSAGES.BASE.ALLOWED_CHARACTERS),
  },
});

const fieldsValidation = useFieldsValidation(rules, data);

const loginFormValidation = useFormValidation(fieldsValidation);

const onFormSubmit = debounce(async () => {
  loginFormValidation.checkValidity();

  if (!loginFormValidation.valid) {
    return;
  }

  const response = await authStore.logIn(data);

  if (response.status === HTTP_STATUS.OK) {
    router.push('/');
  }
});
</script>
