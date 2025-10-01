<template>
  <AppHeader class="fixed px-[24px] top-0 left-0 min-w-[580px]" />

  <div class="flex items-center justify-center w-screen h-screen min-w-[580px]">
    <router-view />
  </div>

  <AppNotifier />
</template>

<script setup>
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppNotifier from '@/components/AppNotifier/AppNotifier.vue';
</script>
