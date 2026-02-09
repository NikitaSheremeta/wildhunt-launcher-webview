<template>
  <div class="flex flex-col">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Подтверждение аккаунта</h1>

    <p class="text-gray-500 mt-2">Код был отправлен на электронную почту, которую вы указали при регистрации</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode />

      <AppLink
        v-if="!timer.active"
        color="primary"
        label="Отправить код еще раз"
        iconLeft="redo"
        small
        class="mt-4"
        @click.prevent="onClickResendLink"
      />

      <span v-if="timer.active" class="text-gray-500 text-sm" v-text="notice" />
    </div>
  </div>
</template>

<script setup>
import { useTimer } from '@/hooks/useTimer';
import { computed, onMounted } from 'vue';
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
