<template>
  <form class="flex flex-col mt-40 w-80 select-none" @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Вход в аккаунт</h1>

    <div class="flex flex-col gap-4 mt-6">
      <AppInput
        id="login"
        name="login"
        type="text"
        placeholder="Логин или электронная почта"
        autocomplete
        autofocus
        v-model="data.login"
        :validation="fieldsValidation.login"
        :maxLength="VALIDATION_CONSTRAINTS.LOGIN_OR_EMAIL.MAX_LENGTH"
      />

      <AppInput
        id="password"
        name="password"
        type="password"
        placeholder="Пароль"
        v-model="data.password"
        :validation="fieldsValidation.password"
        :maxLength="VALIDATION_CONSTRAINTS.PASSWORD.MAX_LENGTH"
      />
    </div>

    <div class="mt-6">
      <AppButton
        id="login-button"
        theme="primary"
        type="submit"
        label="Войти"
        :disabled="isSubmitDisabled"
        :loading="isLogInLoading"
      />
    </div>

    <span class="mt-3 text-sm text-gray-600 hover:text-white active:text-white cursor-pointer">
      Забыли пароль или не можете войти?
    </span>
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { required, maxLength, minLength, allowedCharacters } from '@/utils/validators';
import { VALIDATION_MESSAGES } from '@/constants/validation-messages';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';
import { useFieldsValidation } from '@/hooks/useFieldsValidation';
import { useFormValidator } from '@/hooks/useFormValidator';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';

import AppInput from '@/components/AppInput/AppInput.vue';
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
    minLength: minLength(VALIDATION_CONSTRAINTS.LOGIN.MIN_LENGTH, VALIDATION_MESSAGES.LOGIN.MIN_LENGTH),
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

const isSubmitDisabled = computed(() => isLogInLoading.value || !formValidator.isValid.value);

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
