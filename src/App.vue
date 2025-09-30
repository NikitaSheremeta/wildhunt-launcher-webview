<template>
  <Header class="fixed px-[24px] top-0 left-0 min-w-[580px]" />

  <div class="flex items-center justify-center w-screen h-screen min-w-[580px]">
    <router-view />
  </div>

  <NotificationPopup />
</template>

<script setup>
import Header from '@/components/Header/Header.vue';
import NotificationPopup from '@/components/NotificationPopup/NotificationPopup.vue';
</script>
