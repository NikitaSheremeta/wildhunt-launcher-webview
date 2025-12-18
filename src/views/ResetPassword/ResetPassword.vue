<template>
  <Transition name="slide-up" mode="out-in">
    <div :key="step" class="flex flex-col mt-40 w-80 select-none">
      <ResetPasswordInitialForm v-if="step === 'initial'" @success="goTo('code')" />
      <ResetPasswordCodeForm v-else-if="step === 'code'" @success="goTo('final')" />
      <ResetPasswordFinalForn v-else-if="step === 'final'" />
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import ResetPasswordInitialForm from '@/views/ResetPassword/ResetPasswordInitialForm/ResetPasswordInitialForm.vue';
import ResetPasswordCodeForm from '@/views/ResetPassword/ResetPasswordCodeForm/ResetPasswordCodeForm.vue';
import ResetPasswordFinalForn from '@/views/ResetPassword/ResetPasswordFinalForn/ResetPasswordFinalForn.vue';

const step = ref('initial');

function goTo(nextStep) {
  step.value = nextStep;
}
</script>
