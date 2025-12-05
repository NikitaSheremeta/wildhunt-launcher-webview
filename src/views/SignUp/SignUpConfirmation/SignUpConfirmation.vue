<template>
  <div class="flex flex-col">
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Подтверждение аккаунта</h1>

    <p class="text-gray-500 mt-2">Код был отправлен на электронную почту, которую вы указали при регистрации</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode />
    </div>
  </div>
</template>

<script setup>
import AppCode from '@/components/AppCode/AppCode.vue';
</script>
