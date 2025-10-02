<template>
  <form class="flex flex-col w-80 select-none" @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">
      <AppIcon icon="login" />

      Вход в аккаунт
    </h1>

    <div class="flex flex-col gap-4 mt-6">
      <input
        id="login"
        v-model="data.login"
        @blur="fieldsValidation.login.blur"
        type="text"
        class="px-6 h-12 rounded-xl bg-gray-800 text-white placeholder:text-gray-600 hover:placeholder:text-gray-700 focus:placeholder:text-gray-700 outline-none"
        placeholder="Имя игрока / электронная почта"
      />

      <input
        id="password"
        v-model="data.password"
        type="password"
        class="px-6 h-12 rounded-xl bg-gray-800 text-white placeholder:text-gray-600 hover:placeholder:text-gray-700 focus:placeholder:text-gray-700 outline-none"
        placeholder="Пароль"
      />
    </div>

    <div class="mt-6">
      <AppButton
        id="login-button"
        type="submit"
        theme="primary"
        label="Войти"
        :disabled="isLogInLoading"
        :loading="isLogInLoading"
      />
    </div>

    <span class="mt-4 text-sm text-gray-600 hover:text-white active:text-white cursor-pointer">
      Забыли пароль или не можете войти?
    </span>
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';
import { required, maxLength, minLength, allowedCharacters } from '@/utils/validators';
import { VALIDATION_MESSAGES } from '@/constants/validation-messages';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';
import { useFieldsValidation } from '@/hooks/useFieldsValidation';
import { useFormValidator } from '@/hooks/useFormValidator';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';

import AppIcon from '@/components/AppIcon/AppIcon.vue';
import AppButton from '@/components/AppButton/AppButton.vue';

const authStore = useAuthStore();
const router = useRouter();

const { isLogInLoading } = storeToRefs(authStore);

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

const formValidator = useFormValidator(fieldsValidation);

const onFormSubmit = debounce(async () => {
  const isValid = formValidator.validate();

  if (!isValid) {
    return;
  }

  const response = await authStore.logIn(data);

  if (response.status === HTTP_STATUS.OK) {
    router.push('/');
  }
});
</script>
