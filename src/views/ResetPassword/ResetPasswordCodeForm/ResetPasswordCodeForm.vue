<template>
  <form>
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Восстановление пароля</h1>
    <p class="text-sm text-gray-600 mt-2">Укажите код, который был отправлен на вашу электронную почту</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode v-model="code" :disabled="isResetCodeLoading" />
    </div>

    <AppLink
      v-if="!timer.active"
      color="primary"
      label="Отправить код еще раз"
      iconLeft="redo"
      small
      class="mt-4"
      @click.prevent="onClickResendLink"
    />

    <span v-if="timer.active" class="block mt-4 text-sm text-gray-600 user-select-none" v-text="notice" />
  </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useTimer } from '@/hooks/useTimer';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';
import AppCode from '@/components/AppCode/AppCode.vue';
import AppLink from '@/components/AppLink/AppLink.vue';

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;
const RESET_PASSWORD_EMAIL_STORAGE_KEY = 'resetPassword.email';
const RESET_PASSWORD_CODE_STORAGE_KEY = 'resetPassword.code';

const emit = defineEmits(['success', 'back']);

const authStore = useAuthStore();
const { isResetCodeLoading } = storeToRefs(authStore);

const timer = useTimer();
const notice = computed(() => 'Отправить код повторно можно через ' + timer.time);

const email = ref('');
const code = ref([]);
const lastSubmittedCode = ref('');

const codeString = computed(() => (code.value || []).join(''));
const isCodeComplete = computed(() => (code.value || []).length > 0 && (code.value || []).every((d) => d !== ''));

const onClickResendLink = debounce(async () => {
  if (!email.value) {
    emit('back');

    return;
  }

  const response = await authStore.resetPassword({ email: email.value });

  if (response.status === HTTP_STATUS.OK) {
    timer.createTimer(FIFTEEN_MINUTES_IN_SECONDS);
  }
});

onMounted(() => {
  try {
    email.value = (localStorage.getItem(RESET_PASSWORD_EMAIL_STORAGE_KEY) || '').trim();
  } catch {
    email.value = '';
  }

  if (!email.value) {
    emit('back');

    return;
  }

  timer.checkTimer();
});

watch([isCodeComplete, codeString], async ([complete, currentCode]) => {
  if (!complete) {
    lastSubmittedCode.value = '';

    return;
  }

  if (!email.value) {
    emit('back');

    return;
  }

  if (!currentCode || currentCode === lastSubmittedCode.value) {
    return;
  }

  lastSubmittedCode.value = currentCode;

  const response = await authStore.resetCode({ code: currentCode });

  if (response.status === HTTP_STATUS.OK) {
    try {
      localStorage.setItem(RESET_PASSWORD_CODE_STORAGE_KEY, currentCode);
    } catch {}

    emit('success');
  }
});
</script>
