<template>
  <form>
    <h1 class="text-2xl text-white inline-flex items-center gap-2">Восстановление пароля</h1>
    <p class="text-sm text-gray-600 mt-2">Укажите код, который был отправлен на вашу электронную почту</p>

    <div class="flex flex-col gap-4 mt-6">
      <AppCode />
    </div>
  </form>
</template>

<script setup>
import AppCode from '@/components/AppCode/AppCode.vue';
</script>
