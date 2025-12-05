<template>
  <Transition name="fade-slide-up">
    <div v-if="true" class="flex flex-col mt-40 w-80 select-none">
      <SignUpForm />
    </div>
  </Transition>

  <Transition name="fade-slide-up">
    <div v-if="false" class="flex flex-col mt-40 w-80 select-none">
      <SignUpConfirmation />
    </div>
  </Transition>
</template>

<script setup>
import SignUpForm from '@/views/SignUp/SignUpForm/SignUpForm.vue';
import SignUpConfirmation from '@/views/SignUp/SignUpConfirmation/SignUpConfirmation.vue';
</script>
