<template>
  <form @submit.prevent="onFormSubmit">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Восстановление пароля</h1>
    <p class="text-sm text-gray-600 mt-2">Укажите новый пароль</p>

    <div class="flex flex-col gap-4 mt-6">
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
    </div>

    <div class="mt-6">
      <AppButton type="submit" theme="primary" label="Сменить пароль" :loading="isNewPasswordLoading" />
    </div>
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { required, maxLength, minLength, allowedCharacters, sameAs } from '@/utils/validators';
import { VALIDATION_MESSAGES } from '@/constants/validation-messages';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';
import { useFieldsValidation } from '@/hooks/useFieldsValidation';
import { useFormValidator } from '@/hooks/useFormValidator';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';
import AppPassword from '@/components/AppPassword/AppPassword.vue';
import AppButton from '@/components/AppButton/AppButton.vue';

const RESET_PASSWORD_CODE_STORAGE_KEY = 'resetPassword.code';
const RESET_PASSWORD_STEP_STORAGE_KEY = 'resetPassword.step';
const RESET_PASSWORD_EMAIL_STORAGE_KEY = 'resetPassword.email';

const emit = defineEmits(['back']);

const authStore = useAuthStore();
const router = useRouter();

const { isNewPasswordLoading } = storeToRefs(authStore);

const code = ref('');

const data = reactive({
  password: '',
  passwordConfirmation: '',
});

const rules = ref({
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

onMounted(() => {
  try {
    code.value = (localStorage.getItem(RESET_PASSWORD_CODE_STORAGE_KEY) || '').trim();
  } catch {
    code.value = '';
  }

  if (!code.value) {
    emit('back');
  }
});

const onFormSubmit = debounce(async () => {
  if (!code.value) {
    emit('back');

    return;
  }

  const isValid = formValidator.validate();

  if (!isValid) {
    return;
  }

  const response = await authStore.newPassword({
    password: data.password,
    code: code.value,
  });

  if (response.status === HTTP_STATUS.OK) {
    try {
      localStorage.removeItem(RESET_PASSWORD_CODE_STORAGE_KEY);
      localStorage.removeItem(RESET_PASSWORD_STEP_STORAGE_KEY);
      localStorage.removeItem(RESET_PASSWORD_EMAIL_STORAGE_KEY);
    } catch {}

    router.push('/login');
  }
});
</script>
