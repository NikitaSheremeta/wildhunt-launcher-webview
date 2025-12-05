<template>
  <div class="flex flex-col">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Подтверждение аккаунта</h1>

    <p class="text-gray-500 mt-2">Код был отправлен на электронную почту, которую вы указали при регистрации</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode />

      <AppLink
        v-if="!timer.active"
        color="secondary"
        label="Отправить код повторно"
        icon-left="redo"
        small
        underline
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

const ONE_HUNDRED_TWENTY_MILLISECONDS = 120;

const timer = useTimer();

const notice = computed(() => String('Отправить код повторно можно через ' + timer.time));

const onClickResendLink = () => {
  timer.createTimer(ONE_HUNDRED_TWENTY_MILLISECONDS);
};

onMounted(() => {
  timer.checkTimer();
});
</script>
