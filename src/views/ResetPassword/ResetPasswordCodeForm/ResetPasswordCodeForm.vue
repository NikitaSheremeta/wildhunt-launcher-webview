<template>
  <form>
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Восстановление пароля</h1>
    <p class="text-sm text-gray-600 mt-2">Укажите код, который был отправлен на вашу электронную почту</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode />
    </div>

    <AppLink
      v-if="!timer.active"
      color="secondary"
      label="Отправить код еще раз"
      iconLeft="redo"
      small
      underline
      class="mt-4"
      @click.prevent="onClickResendLink"
    />

    <span v-if="timer.active" class="block mt-4 text-sm text-gray-600 user-select-none" v-text="notice" />
  </form>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTimer } from '@/hooks/useTimer';

import AppCode from '@/components/AppCode/AppCode.vue';
import AppLink from '@/components/AppLink/AppLink.vue';

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;

const timer = useTimer();
const notice = computed(() => 'Отправить код повторно можно через ' + timer.time);

const onClickResendLink = () => {
  timer.createTimer(FIFTEEN_MINUTES_IN_SECONDS);
};

onMounted(() => {
  timer.checkTimer();
});
</script>
