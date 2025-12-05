<template>
  <form class="flex flex-col mt-40 w-80 select-none" @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Регистрация аккаунта</h1>

    <div class="flex flex-col gap-4 mt-6">
      <AppInput
        id="username"
        name="username"
        type="text"
        placeholder="Логин"
        v-model="data.username"
        :validation="fieldsValidation.username"
        :maxLength="VALIDATION_CONSTRAINTS.LOGIN_OR_EMAIL.MAX_LENGTH"
      />

      <AppInput
        id="email"
        name="email"
        type="text"
        placeholder="Электронная почта"
        v-model="data.email"
        :validation="fieldsValidation.email"
        :maxLength="VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH"
      />

      <AppPassword
        v-model="data.password"
        create
        placeholder="Пароль"
        :validation="fieldsValidation.password"
        :maxLength="VALIDATION_CONSTRAINTS.PASSWORD.MAX_LENGTH"
      />

      <AppPassword
        v-model="data.passwordConfirmation"
        placeholder="Подтверждение пароля"
        :validation="fieldsValidation.passwordConfirmation"
        :maxLength="VALIDATION_CONSTRAINTS.PASSWORD.MAX_LENGTH"
      />

      <AppCheckbox v-model="flags.eula" label="Я принимаю">
        <AppLink href="terms" color="secondary" label="пользовательское соглашение" small underline />

        <br />и

        <AppLink href="privacy-policy" color="secondary" label="политику конфиденциальности" small underline />
      </AppCheckbox>
    </div>

    <div class="mt-6">
      <AppButton
        :disabled="!flags.eula"
        type="submit"
        theme="primary"
        label="Зарегистрироваться"
        :loading="isSignUpLoading"
      />
    </div>
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';

import { required, maxLength, minLength, allowedCharacters, email, sameAs } from '@/utils/validators';

import { VALIDATION_MESSAGES } from '@/constants/validation-messages';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';

import { useFieldsValidation } from '@/hooks/useFieldsValidation';
import { useFormValidator } from '@/hooks/useFormValidator';

import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';

import AppInput from '@/components/AppInput/AppInput.vue';
import AppPassword from '@/components/AppPassword/AppPassword.vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppCheckbox from '@/components/AppCheckbox/AppCheckbox.vue';
import AppLink from '@/components/AppLink/AppLink.vue';

const authStore = useAuthStore();
const router = useRouter();

const { isSignUpLoading } = storeToRefs(authStore);

const data = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const flags = reactive({
  eula: true,
});

const rules = ref({
  username: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    minLength: minLength(VALIDATION_CONSTRAINTS.LOGIN.MIN_LENGTH, VALIDATION_MESSAGES.LOGIN.MIN_LENGTH),
    maxLength: maxLength(VALIDATION_CONSTRAINTS.LOGIN.MAX_LENGTH, VALIDATION_MESSAGES.LOGIN.MAX_LENGTH),
    allowedCharacters: allowedCharacters(VALIDATION_MESSAGES.BASE.ALLOWED_CHARACTERS),
  },
  email: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    email: email(VALIDATION_MESSAGES.EMAIL.INCORRECT),
  },
  password: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    minLength: minLength(VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH),
    maxLength: maxLength(VALIDATION_CONSTRAINTS.PASSWORD.MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD.MAX_LENGTH),
    allowedCharacters: allowedCharacters(VALIDATION_MESSAGES.BASE.ALLOWED_CHARACTERS),
  },
  passwordConfirmation: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    sameAs: sameAs(() => data.password, VALIDATION_MESSAGES.CONFIRM_PASSWORD.SAME_AS),
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

  const response = await authStore.signUp(data);

  if (response.status === HTTP_STATUS.OK) {
    router.push('/');
  }
});
</script>
