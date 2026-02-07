<template>
  <form>
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Восстановление пароля</h1>
    <p class="text-sm text-gray-600 mt-2">Укажите код, который был отправлен на вашу электронную почту</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode />
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
import { computed, onMounted, ref } from 'vue';
import { useTimer } from '@/hooks/useTimer';
import { debounce } from '@/utils/debounce';
import { HTTP_STATUS } from '@/constants/status-codes';
import AppCode from '@/components/AppCode/AppCode.vue';
import AppLink from '@/components/AppLink/AppLink.vue';

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;
const RESET_PASSWORD_EMAIL_STORAGE_KEY = 'resetPassword.email';

const emit = defineEmits(['success', 'back']);

const authStore = useAuthStore();

const timer = useTimer();
const notice = computed(() => 'Отправить код повторно можно через ' + timer.time);

const email = ref('');

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
</script>
