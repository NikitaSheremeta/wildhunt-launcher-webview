<template>
  <Transition name="slide-up" mode="out-in">
    <div :key="step" class="flex flex-col mt-40 w-80 select-none">
      <ResetPasswordInitialForm v-if="step === 'initial'" @success="goTo('code')" />
      <ResetPasswordCodeForm v-else-if="step === 'code'" @success="goTo('final')" @back="goTo('initial')" />
      <ResetPasswordFinalForn v-else-if="step === 'final'" />
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import ResetPasswordInitialForm from '@/views/ResetPassword/ResetPasswordInitialForm/ResetPasswordInitialForm.vue';
import ResetPasswordCodeForm from '@/views/ResetPassword/ResetPasswordCodeForm/ResetPasswordCodeForm.vue';
import ResetPasswordFinalForn from '@/views/ResetPassword/ResetPasswordFinalForn/ResetPasswordFinalForn.vue';

const RESET_PASSWORD_STEP_STORAGE_KEY = 'resetPassword.step';
const ALLOWED_STEPS = new Set(['initial', 'code', 'final']);

const step = ref('initial');

try {
  const savedStep = localStorage.getItem(RESET_PASSWORD_STEP_STORAGE_KEY);

  if (savedStep && ALLOWED_STEPS.has(savedStep)) {
    step.value = savedStep;
  }
} catch {}

function goTo(nextStep) {
  step.value = nextStep;
}

watch(step, (value) => {
  if (!ALLOWED_STEPS.has(value)) {
    return;
  }

  try {
    localStorage.setItem(RESET_PASSWORD_STEP_STORAGE_KEY, value);
  } catch {}
});
</script>
