<template>
  <form @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Восстановление пароля</h1>
    <p class="text-sm text-gray-600 mt-2">Укажите электронную почту, которую вы использовали при регистрации</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppInput
        id="email"
        name="email"
        type="email"
        placeholder="Электронная почта"
        v-model="data.email"
        :validation="fieldsValidation.email"
        :maxLength="VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH"
      />
    </div>

    <div class="mt-6">
      <AppButton
        type="submit"
        theme="primary"
        label="Восстановить"
        :loading="isResetPasswordLoading"
        @click.prevent="onFormSubmit"
      />
    </div>

    <AppLink
      href="/support"
      color="secondary"
      label="Утрачен доступ к электронной почте"
      iconLeft="question"
      small
      underline
      class="mt-4"
    />
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, ref, reactive } from 'vue';
import { required, email } from '@/utils/validators';
import { VALIDATION_MESSAGES } from '@/constants/validation-messages';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';
import { useFieldsValidation } from '@/hooks/useFieldsValidation';
import { useFormValidator } from '@/hooks/useFormValidator';
import { useTimer } from '@/hooks/useTimer';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';
import AppInput from '@/components/AppInput/AppInput.vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppLink from '@/components/AppLink/AppLink.vue';

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;
const RESET_PASSWORD_EMAIL_STORAGE_KEY = 'resetPassword.email';

const emit = defineEmits(['success']);

const authStore = useAuthStore();

const { isResetPasswordLoading } = storeToRefs(authStore);

const data = reactive({
  email: '',
});

onMounted(() => {
  try {
    const savedEmail = localStorage.getItem(RESET_PASSWORD_EMAIL_STORAGE_KEY);

    if (savedEmail && !data.email) {
      data.email = savedEmail;
    }
  } catch {
    console.warn('Не удалось прочитать email восстановления из localStorage');
  }
});

const rules = ref({
  email: {
    required: required(VALIDATION_MESSAGES.BASE.REQUIRED),
    email: email(VALIDATION_MESSAGES.EMAIL.INCORRECT),
  },
});

const fieldsValidation = useFieldsValidation(rules, data);

const formValidator = useFormValidator(fieldsValidation);

const timer = useTimer();

const onFormSubmit = debounce(async () => {
  try {
    localStorage.setItem(RESET_PASSWORD_EMAIL_STORAGE_KEY, (data.email ?? '').trim());
  } catch {
    console.warn('Не удалось сохранить email восстановления в localStorage');
  }

  const isValid = formValidator.validate();

  if (!isValid) {
    return;
  }

  const response = await authStore.resetPassword({ email: data.email });

  if (response.status === HTTP_STATUS.OK) {
    timer.createTimer(FIFTEEN_MINUTES_IN_SECONDS);

    emit('success');
  }
});
</script>
